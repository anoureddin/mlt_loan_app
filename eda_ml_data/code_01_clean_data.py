import pandas as pd
import os

datasets_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "datasets")
input_path = os.path.join(datasets_dir, "loan_prediction.csv")

# Read the dataset
df = pd.read_csv(input_path)
# Drop 'Loan_ID'
df = df.drop('Loan_ID', axis=1)

# Fill missing categorical values with mode (safe assignment)
for col in ['Gender', 'Married', 'Dependents', 'Self_Employed']:
    df[col] = df[col].fillna(df[col].mode()[0])

# Fill missing numerical values
df['LoanAmount'] = df['LoanAmount'].fillna(df['LoanAmount'].median())
df['Loan_Amount_Term'] = df['Loan_Amount_Term'].fillna(df['Loan_Amount_Term'].mode()[0])
df['Credit_History'] = df['Credit_History'].fillna(df['Credit_History'].mode()[0])


# Convert '3+' to 3 and cast to int
df['Dependents'] = df['Dependents'].replace('3+', 3).astype(int)


#Extract the data as (cleaned_data_loan_prediction.csv)
output_path = os.path.join(datasets_dir, "cleaned_data_loan_prediction.csv")
df.to_csv(output_path, index=False)