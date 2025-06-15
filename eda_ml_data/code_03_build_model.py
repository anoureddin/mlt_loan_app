import pandas as pd
import os
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
from sklearn.metrics import roc_curve, auc
from sklearn.model_selection import StratifiedKFold, cross_val_score




warnings.filterwarnings('ignore')
os.makedirs('charts_and_plots', exist_ok=True)

datasets_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "datasets")
input_path = os.path.join(datasets_dir, "cleaned_data_loan_prediction.csv")

# Read the dataset
df = pd.read_csv(input_path)





# Apply log1p to reduce skewness and handle outliers
df['ApplicantIncome_log'] = np.log1p(df['ApplicantIncome'])
df['CoapplicantIncome_log'] = np.log1p(df['CoapplicantIncome'])
df['LoanAmount_log'] = np.log1p(df['LoanAmount'])


# Convert 'Y' → 1 and 'N' → 0:
df['Loan_Status'] = df['Loan_Status'].map({'Y': 1, 'N': 0})


# We’ll use One-Hot Encoding to avoid ordering bias:
# One-hot encode remaining categorical features
df = pd.get_dummies(df, columns=['Gender', 'Married', 'Education','Self_Employed', 'Property_Area'], drop_first=True)


# Drop original columns and define features (X) and target (y)
df_model = df.drop(['ApplicantIncome', 'CoapplicantIncome', 'LoanAmount'], axis=1)

X = df_model.drop('Loan_Status', axis=1)
y = df_model['Loan_Status']


# Train Random Forest
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X, y)

# Extract and sort feature importances
importances = rf_model.feature_importances_
feature_names = X.columns
feat_imp_df = pd.DataFrame({'Feature': feature_names, 'Importance': importances})
feat_imp_df = feat_imp_df.sort_values(by='Importance', ascending=False)

# Plot
plt.figure(figsize=(10, 6))
sns.barplot(x='Importance', y='Feature', data=feat_imp_df.head(10), palette='viridis')
plt.title('Top 10 Important Features (Random Forest)')
plt.tight_layout()
plt.savefig(os.path.join('charts_and_plots', 'plot_22_top_10_important_features_random_forest.png'))
print('NEW image added plot_22_top_10_important_features_random_forest.png ')



warnings.filterwarnings("ignore", category=UserWarning)
# Preprocessing setup
preprocessor = ColumnTransformer([
    ('num', StandardScaler(), X.select_dtypes(include=['number']).columns),
])

# Model selection
models = {
    'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    'KNN': KNeighborsClassifier(),
    'Decision Tree': DecisionTreeClassifier(random_state=42),
    'Neural Network': MLPClassifier(max_iter=1000, random_state=42)
}

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

# Model evaluation
results = []
for name, model in models.items():
    pipe = Pipeline([('prep', preprocessor), ('clf', model)])
    pipe.fit(X_train, y_train)
    y_pred = pipe.predict(X_test)

    y_proba = None
    try:
        y_proba = pipe.predict_proba(X_test)[:, 1]
    except AttributeError:
        try:
            scores = pipe.decision_function(X_test)
            y_proba = (scores - scores.min()) / (scores.max() - scores.min())
        except AttributeError:
            pass

    results.append({
        'Model': name,
        'Accuracy': accuracy_score(y_test, y_pred),
        'Precision': precision_score(y_test, y_pred),
        'Recall': recall_score(y_test, y_pred),
        'F1': f1_score(y_test, y_pred),
        'AUC': roc_auc_score(y_test, y_proba) if y_proba is not None else None
    })

# Results display
results_df = pd.DataFrame(results).sort_values('F1', ascending=False)



# Create the directory if it doesn't exist
output_dir = 'results'
os.makedirs(output_dir, exist_ok=True)

# Define the file path
file_path = os.path.join(output_dir, '01_baseline_models_comparison.csv')

# Save the dataframe to a CSV file
results_df.to_csv(file_path, index=True)

print(f"DataFrame saved to {file_path}")



# Predict again to get confusion matrix
y_pred = pipe.predict(X_test)

# Plot confusion matrix
cm = confusion_matrix(y_test, y_pred)
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=['Rejected (0)', 'Approved (1)'])
disp.plot(cmap='Blues')
plt.title('Confusion Matrix - Logistic Regression')
plt.tight_layout()
plt.savefig(os.path.join('charts_and_plots', 'plot_23_confusion_matrix__logistic_regression.png'))
print('NEW image added plot_23_confusion_matrix__logistic_regression.png ')
plt.close()



y_proba = pipe.predict_proba(X_test)[:, 1]
fpr, tpr, thresholds = roc_curve(y_test, y_proba)
roc_auc = auc(fpr, tpr)

plt.figure(figsize=(8, 6))
plt.plot(fpr, tpr, label=f'ROC Curve (AUC = {roc_auc:.4f})', color='blue')
plt.plot([0, 1], [0, 1], linestyle='--', color='gray')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Curve - Logistic Regression')
plt.legend(loc='lower right')
plt.tight_layout()
plt.savefig(os.path.join('charts_and_plots', 'plot_24_roc_curve__logistic_regression.png'))
print('NEW image added plot_24_roc_curve__logistic_regression.png ')
plt.close()






# Models that support class_weight
weighted_models = {
    'Logistic Regression': LogisticRegression(max_iter=1000, class_weight='balanced', random_state=42),
    'Random Forest': RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42),
    'Decision Tree': DecisionTreeClassifier(class_weight='balanced', random_state=42)
}
preprocessor = ColumnTransformer([
    ('num', StandardScaler(), X.select_dtypes(include=['number']).columns),
])

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

# Store results
cw_results = []

for name, model in weighted_models.items():

    # Pipeline with class-weighted model
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', model)
    ])

    # Train model
    pipeline.fit(X_train, y_train)

    # Predict
    y_pred = pipeline.predict(X_test)
    y_proba = pipeline.predict_proba(X_test)[:, 1]

    # Evaluate
    result = {
        'Model': name + " (Weighted)",
        'Accuracy': accuracy_score(y_test, y_pred),
        'Precision': precision_score(y_test, y_pred),
        'Recall': recall_score(y_test, y_pred),
        'F1': f1_score(y_test, y_pred),
        'AUC': roc_auc_score(y_test, y_proba)
    }

    cw_results.append(result)

# Combine with previous results for comparison
comparison_df = pd.concat([
    results_df,
    pd.DataFrame(cw_results)
], ignore_index=True)

comparison_df.sort_values(by='F1', ascending=False)



# Create the directory if it doesn't exist
output_dir = 'results'
os.makedirs(output_dir, exist_ok=True)

# Define the file path
file_path = os.path.join(output_dir, '02_weighted_models_vs_baseline_models.csv')

# Save the dataframe to a CSV file
comparison_df.to_csv(file_path, index=True)

print(f"DataFrame saved to {file_path}")



print("#####" * 10)
print("#####" * 10)

print("BUILDING LogisticRegression on weighted_data")

print("#####" * 10)
print("#####" * 10)


# Rebuild pipeline
best_model = LogisticRegression(max_iter=1000, class_weight='balanced', random_state=42)

best_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', best_model)
])

# Cross-validation (20-fold stratified)
cv = StratifiedKFold(n_splits=20, shuffle=True, random_state=42)
cv_scores = cross_val_score(best_pipeline, X, y, cv=cv, scoring='f1')

# Train on full dataset
best_pipeline.fit(X, y)

# Report results
print("Cross-validation F1 scores:", cv_scores)
print("Mean F1 Score:", cv_scores.mean())

# Predict again to get confusion matrix
y_pred = best_pipeline.predict(X_test)

# Plot confusion matrix
cm = confusion_matrix(y_test, y_pred)
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=['Rejected (0)', 'Approved (1)'])
disp.plot(cmap='Blues')
plt.title('Confusion Matrix - Logistic Regression (Weighted)')
plt.tight_layout()
plt.savefig(os.path.join('charts_and_plots', 'plot_25_confusion_matrix__logistic_regression_weighted.png'))
print('NEW image added plot_25_confusion_matrix__logistic_regression_weighted.png ')
plt.close()


y_proba = best_pipeline.predict_proba(X_test)[:, 1]
fpr, tpr, thresholds = roc_curve(y_test, y_proba)
roc_auc = auc(fpr, tpr)

plt.figure(figsize=(8, 6))
plt.plot(fpr, tpr, label=f'ROC Curve (AUC = {roc_auc:.4f})', color='blue')
plt.plot([0, 1], [0, 1], linestyle='--', color='gray')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Curve - Logistic Regression (Weighted)')
plt.legend(loc='lower right')
plt.tight_layout()
plt.savefig(os.path.join('charts_and_plots', 'plot_26_roc_curve__logistic_regression_weighted.png'))
print('NEW image added plot_26_roc_curve__logistic_regression_weighted.png ')
plt.close()




# Create the 'models' directory if it doesn't exist
models_dir = 'models'
os.makedirs(models_dir, exist_ok=True)

# Define the filename
filename = 'logistic_regression_weighted.pkl'
filepath = os.path.join(models_dir, filename)

# Save the best_pipeline model
joblib.dump(best_pipeline, filepath)


print("#####" * 10)
print("#####" * 10)
print("#####" * 10)
print("#####" * 10)
print("#####" * 10)
print("#####" * 10)
print("#####" * 10)
print("#####" * 10)



print(f"Model saved to {filepath}")

print("#####" * 10)
print("#####" * 10)