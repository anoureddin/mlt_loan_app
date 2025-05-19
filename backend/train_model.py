import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import precision_score, recall_score, f1_score, accuracy_score
import json

# Load the dataset
df = pd.read_csv("loan_prediction.csv")

# Clean and preprocess
df.dropna(inplace=True)
df = df.drop(columns=["Loan_ID"])
df['Loan_Status'] = df['Loan_Status'].map({'Y': 1, 'N': 0})
df = pd.get_dummies(df, drop_first=True)

# Split data
X = df.drop("Loan_Status", axis=1)
y = df["Loan_Status"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Predict and evaluate
y_pred = model.predict(X_test)
metrics = {
    "accuracy": accuracy_score(y_test, y_pred),
    "precision": precision_score(y_test, y_pred),
    "recall": recall_score(y_test, y_pred),
    "f1_score": f1_score(y_test, y_pred)
}

# Save model
joblib.dump(model, "api/ml_model.pkl")

# Save metrics to a file
with open("api/metrics.json", "w") as f:
    json.dump(metrics, f, indent=2)

print("Model trained and saved. Metrics:")
print(metrics)
