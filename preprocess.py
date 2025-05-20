import pandas as pd

# Download data
df = pd.read_csv("loan_prediction.csv")  

# Handling missing values
df['Loan_Amount_Term'].fillna(df['Loan_Amount_Term'].mean(), inplace=True)

# Save the file after cleaning.
df.to_csv("cleaned_loan_data.csv", index=False)

print("Preprocessing done successfully.")
