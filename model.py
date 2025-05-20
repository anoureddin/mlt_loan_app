import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

# Reading data
df = pd.read_csv("cleaned_loan_data.csv")  

# Splitting data into inputs (X) and outputs (y)
X = df.drop(['Loan_Status'], axis=1)
y = df['Loan_Status']

# Handling non-numeric data (if present)
X = pd.get_dummies(X)

# Splitting data into training and testing
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Model training
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Prediction and results
y_pred = model.predict(X_test)

# Print evaluation
print(classification_report(y_test, y_pred))
print("Accuracy:", accuracy_score(y_test, y_pred))
