"""
Central helpers for the loan-approval API.
"""

from functools import lru_cache
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

# ───────────────────────────────────────────────────────────────
# PATHS – adjust if your folders differ
# ───────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent

DATA_ROOT = (BASE_DIR / "../../eda_ml_data").resolve()
DATASET_DIR = DATA_ROOT / "datasets"
RESULTS_DIR = DATA_ROOT / "results"
MODEL_DIR = DATA_ROOT / "models"

RAW_CSV = DATASET_DIR / "loan_prediction.csv"
CLEAN_CSV = DATASET_DIR / "cleaned_data_loan_prediction.csv"
MODEL_PATH = MODEL_DIR / "logistic_regression_weighted.pkl"

BASELINE_CSV = RESULTS_DIR / "01_baseline_models_comparison.csv"
WEIGHTED_CSV = RESULTS_DIR / "02_weighted_models_vs_baseline_models.csv"


# ───────────────────────────────────────────────────────────────
# DATA LOADING
# ───────────────────────────────────────────────────────────────
@lru_cache(maxsize=2)
def get_dataset(*, cleaned: bool = True) -> pd.DataFrame:
    """
    Return the cleaned or raw dataframe, cached in memory.
    """
    path = CLEAN_CSV if cleaned else RAW_CSV
    return pd.read_csv(path)


# ───────────────────────────────────────────────────────────────
# PICKLED MODEL
# ───────────────────────────────────────────────────────────────
@lru_cache(maxsize=1)
def get_model():
    return joblib.load(MODEL_PATH)


try:
    _EXPECTED_COLS: list[str] | None = list(get_model().feature_names_in_)
except AttributeError:
    _EXPECTED_COLS = None


# ───────────────────────────────────────────────────────────────
#  PRE-PROCESSING (only needed if pipe lacks its own)
# ───────────────────────────────────────────────────────────────
_CATS = ["Gender", "Married", "Education", "Self_Employed", "Property_Area"]


def _prepare(df_raw: pd.DataFrame) -> pd.DataFrame:
    """
    Recreate the exact manual transformations used during training.
    Needed only if the pickle does *not* contain its own preprocessing.
    """
    df = df_raw.copy()

    # 1 – imputations
    for col in ["Gender", "Married", "Dependents", "Self_Employed"] + _CATS:
        df[col] = df[col].fillna(df[col].mode()[0])

    df["LoanAmount"] = df["LoanAmount"].fillna(df["LoanAmount"].median())
    df["Loan_Amount_Term"] = df["Loan_Amount_Term"].fillna(
        df["Loan_Amount_Term"].mode()[0]
    )
    df["Credit_History"] = df["Credit_History"].fillna(df["Credit_History"].mode()[0])

    # 2 – Dependents “3+” → 3
    df["Dependents"] = df["Dependents"].replace("3+", 3).astype("float64")

    # 3 – log columns
    df["ApplicantIncome_log"] = np.log1p(df["ApplicantIncome"])
    df["CoapplicantIncome_log"] = np.log1p(df["CoapplicantIncome"])
    df["LoanAmount_log"] = np.log1p(df["LoanAmount"])

    df = df.drop(["ApplicantIncome", "CoapplicantIncome", "LoanAmount"], axis=1)

    # 4 – one-hot encode (drop_first to match training script)
    df = pd.get_dummies(df, columns=_CATS, drop_first=True)

    # 5 – align to training column order
    if _EXPECTED_COLS is not None:
        df = df.reindex(columns=_EXPECTED_COLS, fill_value=0)

    return df


# ───────────────────────────────────────────────────────────────
#  PREDICTION HELPER (used by POST /api/requests/)
# ───────────────────────────────────────────────────────────────
def predict_one(raw_row: dict) -> str:
    """
    Run the model on a single row of *raw* inputs.
    Returns "Y" (approved) or "N" (rejected).
    """
    rename = {
        "gender": "Gender",
        "married": "Married",
        "dependents": "Dependents",
        "education": "Education",
        "self_employed": "Self_Employed",
        "applicant_income": "ApplicantIncome",
        "coapplicant_income": "CoapplicantIncome",
        "loan_amount": "LoanAmount",
        "loan_amount_term": "Loan_Amount_Term",
        "credit_history": "Credit_History",
        "property_area": "Property_Area",
    }
    row_for_model = {rename.get(k, k): v for k, v in raw_row.items()}

    # ② continue exactly as before
    X_raw = pd.DataFrame([row_for_model])

    # X_raw = pd.DataFrame([raw_row])

    if _EXPECTED_COLS is None:  # pipeline already handles preprocessing
        X = X_raw
    else:
        X = _prepare(X_raw)

    pred = get_model().predict(X)[0]
    return "Y" if pred in (1, "Y") else "N"


# ───────────────────────────────────────────────────────────────
#  SIMPLE EDA SUMMARY
# ───────────────────────────────────────────────────────────────
def summarise(df: pd.DataFrame) -> dict:
    """
    A minimal JSON-friendly overview of a dataframe.
    """
    return {
        "shape": df.shape,
        "missing_per_column": df.isna().sum().to_dict(),
        "numerical_summary": df.describe(include="number").round(2).to_dict(),
        "categorical_summary": {
            col: df[col].value_counts().to_dict()
            for col in df.select_dtypes(include="object").columns
        },
    }


# ───────────────────────────────────────────────────────────────
#  RAW DATA ISSUES
# ───────────────────────────────────────────────────────────────
def data_issues_report() -> dict:
    df = get_dataset(cleaned=False)  # inspect *raw* file
    issues = []

    # missing values
    miss_ratio = df.isna().mean()
    missing_cols = miss_ratio[miss_ratio > 0].index.tolist()
    if missing_cols:
        issues.append(
            {
                "title": "Missing values",
                "details": f"Columns with NaNs: {missing_cols}",
                "suggestion": "Handled in cleaned CSV via mode/median imputation.",
            }
        )

    # non-positive income
    if (df["ApplicantIncome"] <= 0).any():
        issues.append(
            {
                "title": "Non-positive applicant income",
                "details": "At least one row has ApplicantIncome ≤ 0.",
                "suggestion": "Remove or correct these rows before training.",
            }
        )

    return {"issues_found": len(issues), "issues": issues}


# ───────────────────────────────────────────────────────────────
#  MODEL METRICS
# ───────────────────────────────────────────────────────────────
@lru_cache(maxsize=1)
def model_metrics() -> dict:
    if not BASELINE_CSV.exists() or not WEIGHTED_CSV.exists():
        return {"error": "metrics CSV files not found"}

    df = (
        pd.concat(
            [pd.read_csv(BASELINE_CSV), pd.read_csv(WEIGHTED_CSV)],
            ignore_index=True,
        )
        .sort_values("F1", ascending=False)
        .reset_index(drop=True)
    )

    # nicer numbers
    for col in ["Accuracy", "Precision", "Recall", "F1", "AUC"]:
        if col in df.columns:
            df[col] = df[col].round(4)

    return {
        "models": df.to_dict(orient="records"),
        "source_files": [BASELINE_CSV.name, WEIGHTED_CSV.name],
        "best_model": df.iloc[0]["Model"],
    }
