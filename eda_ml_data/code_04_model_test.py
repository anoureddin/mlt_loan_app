import os
import joblib
import pandas as pd
import numpy as np


# Get the directory of the current script
models_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")


def predict_loan_approval(sample_data):
    # Load the model
    with open(os.path.join(models_dir, "logistic_regression_weighted.pkl"), "rb") as f:
        model = joblib.load(f)

    # Apply log transformation to ApplicantIncome
    sample_data['ApplicantIncome_log'] = np.log1p(sample_data['ApplicantIncome'])
    sample_data['CoapplicantIncome_log'] = np.log1p(sample_data['CoapplicantIncome'])
    sample_data['LoanAmount_log'] = np.log1p(sample_data['LoanAmount'])

    # Drop the original column if the model expects only the transformed one
    sample_data = sample_data.drop(['ApplicantIncome', 'CoapplicantIncome', 'LoanAmount'], axis=1)
    # Make predictions
    predictions = model.predict(sample_data)
    probabilities = model.predict_proba(sample_data)[:, 1]

    return predictions, probabilities

# Create sample data that matches the features your model was trained on
sample_data = pd.DataFrame({
    'Gender': ['Male'],
    'Married': ['No'],
    'Dependents': ['0'],
    'Education': ['Graduate'],
    'Self_Employed': ['No'],
    'ApplicantIncome': [4500],  # Original value
    'CoapplicantIncome': [400],
    'LoanAmount': [40],
    'Loan_Amount_Term': [360],
    'Credit_History': [1],
    'Property_Area': ['Urban']
})

# Make predictions
predictions, probabilities = predict_loan_approval(sample_data)

# Create results DataFrame
results = pd.DataFrame({
    "Predicted_Status": predictions,
    "Approval_Probability": probabilities
})

# Display results
print(results)