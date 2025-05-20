import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.read_csv("loan_prediction.csv")

print(df.head())
print(df.info())
print(df.describe())

# Quick Charts
sns.countplot(x="Loan_Status", data=df)
plt.title("Loan Status Distribution")
plt.show()
