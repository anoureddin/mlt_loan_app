import pandas as pd
import os
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')
os.makedirs('charts_and_plots', exist_ok=True)


datasets_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "datasets")
input_path = os.path.join(datasets_dir, "cleaned_data_loan_prediction.csv")

# Read the dataset
df = pd.read_csv(input_path)

plt.figure(figsize=(10, 4))

# Define palette colors to reuse for pie chart
palette = sns.color_palette("coolwarm", n_colors=df['Gender'].nunique())

# Subplot 1: Countplot
ax1 = plt.subplot(1, 2, 1)
ax = sns.countplot(x='Gender', hue='Gender', data=df, palette=palette, legend=False, ax=ax1)
plt.title('Distribution of Gender')
for p in ax.patches:
    ax.annotate(f'{p.get_height()}',
                (p.get_x() + p.get_width() / 2, p.get_height() - 10),
                ha='center', va='top')

# Subplot 2: Pie chart
ax2 = plt.subplot(1, 2, 2)
gender_counts = df['Gender'].value_counts()
ax2.pie(gender_counts, labels=gender_counts.index, colors=palette, autopct='%1.1f%%', startangle=140)
plt.tight_layout()
plt.savefig(os.path.join('charts_and_plots', 'plot_01_distribution_of_gender.png'))
print('NEW IMAGE ADDED plot_01_distribution_of_gender.png ')
plt.close()


fig, axs = plt.subplots(1, 2, figsize=(10, 4))

# Get categories and their counts in order
categories = df['Married'].value_counts().index.tolist()
counts = df['Married'].value_counts().values

# Create a palette with consistent colors for categories
palette = dict(zip(categories, sns.color_palette('coolwarm', n_colors=len(categories))))

# Plot countplot with color palette
ax = sns.countplot(x='Married', data=df, palette=palette, ax=axs[0])
axs[0].set_title('Distribution of Marital Status')
for p in ax.patches:
    axs[0].annotate(f'{p.get_height()}', (p.get_x() + p.get_width() / 2, p.get_height()-10),
                    ha='center', va='top')

# Plot pie chart with same colors in same order as categories
axs[1].pie(counts, labels=categories, autopct='%1.1f%%',
           colors=[palette[c] for c in categories], startangle=90)

plt.tight_layout()
plt.savefig(os.path.join('charts_and_plots', 'plot_02_distribution_of_marital_status.png'))
print('NEW IMAGE ADDED plot_02_distribution_of_marital_status.png ')
plt.close()


fig, axs = plt.subplots(1, 2, figsize=(10, 4))

ax = sns.countplot(x='Education', hue='Education', data=df, palette='coolwarm', legend=False, ax=axs[0])
axs[0].set_title('Distribution of Education')
for p in ax.patches:
    axs[0].annotate(f'{p.get_height()}', (p.get_x() + p.get_width() / 2, p.get_height()-10),
                    ha='center', va='top')

counts = df['Education'].value_counts()
colors = sns.color_palette('coolwarm', n_colors=len(counts))
axs[1].pie(counts, labels=counts.index, autopct='%1.1f%%', colors=colors, startangle=90)

plt.tight_layout()
plt.savefig(os.path.join('charts_and_plots', 'plot_03_distribution_of_education.png'))
print('NEW IMAGE ADDED plot_03_distribution_of_education.png ')
plt.close()


fig, axs = plt.subplots(1, 2, figsize=(10, 4))

ax = sns.countplot(x='Self_Employed', hue='Self_Employed', data=df, palette='coolwarm', legend=False, ax=axs[0])
axs[0].set_title('Distribution of Self Employment')
for p in ax.patches:
    axs[0].annotate(f'{p.get_height()}', (p.get_x() + p.get_width() / 2, p.get_height()-10),
                    ha='center', va='top')

counts = df['Self_Employed'].value_counts()
colors = sns.color_palette('coolwarm', n_colors=len(counts))
axs[1].pie(counts, labels=counts.index, autopct='%1.1f%%', colors=colors, startangle=90)

plt.tight_layout()
plt.savefig(os.path.join('charts_and_plots', 'plot_04_distribution_of_self_employment.png'))
print('NEW IMAGE ADDED plot_04_distribution_of_self_employment.png ')
plt.close()


fig, axs = plt.subplots(1, 2, figsize=(10, 4))

# Get sorted unique categories
categories = sorted(df['Property_Area'].unique())

# Get palette with the same number of colors as categories
palette = sns.color_palette('coolwarm', n_colors=len(categories))

# Create a color map {category: color}
color_map = dict(zip(categories, palette))

# Countplot with hue as Property_Area (to use colors per category)
ax = sns.countplot(x='Property_Area', data=df, palette=color_map, ax=axs[0])
axs[0].set_title('Distribution of Property Area')

# Annotate bars
for p in ax.patches:
    axs[0].annotate(f'{p.get_height()}',
                    (p.get_x() + p.get_width() / 2, p.get_height() - 10),
                    ha='center', va='top')

# Pie chart with colors in the same order as categories
counts = df['Property_Area'].value_counts().reindex(categories)
axs[1].pie(counts, labels=counts.index, autopct='%1.1f%%', colors=[color_map[c] for c in counts.index], startangle=90)

plt.tight_layout()
plt.savefig(os.path.join('charts_and_plots', 'plot_05_distribution_of_property_area.png'))
print('NEW IMAGE ADDED plot_05_distribution_of_property_area.png ')
plt.close()



plt.figure(figsize=(10, 4))

# Distribution
plt.subplot(1, 2, 1)
sns.histplot(df['ApplicantIncome'], kde=True, color='skyblue')
plt.title('Distribution of ApplicantIncome')

# Boxplot
plt.subplot(1, 2, 2)
sns.boxplot(x=df['ApplicantIncome'], color='lightgreen')
plt.title('Boxplot of ApplicantIncome')

plt.tight_layout()
plt.savefig(os.path.join('charts_and_plots', 'plot_06_distribution_of_applicantincome.png'))
print('NEW IMAGE ADDED plot_06_distribution_of_applicantincome.png ')
plt.close()


plt.figure(figsize=(10, 4))

plt.subplot(1, 2, 1)
sns.histplot(df['CoapplicantIncome'], kde=True, color='salmon')
plt.title('Distribution of CoapplicantIncome')

plt.subplot(1, 2, 2)
sns.boxplot(x=df['CoapplicantIncome'], color='orange')
plt.title('Boxplot of CoapplicantIncome')

plt.tight_layout()
plt.savefig(os.path.join('charts_and_plots', 'plot_07_distribution_of_coapplicantincome.png'))
print('NEW IMAGE ADDED plot_07_distribution_of_coapplicantincome.png ')
plt.close()


plt.figure(figsize=(10, 4))

plt.subplot(1, 2, 1)
sns.histplot(df['LoanAmount'], kde=True, color='violet')
plt.title('Distribution of LoanAmount')

plt.subplot(1, 2, 2)
sns.boxplot(x=df['LoanAmount'], color='lightblue')
plt.title('Boxplot of LoanAmount')

plt.tight_layout()
plt.savefig(os.path.join('charts_and_plots', 'plot_08_distribution_of_loanamount.png'))
print('NEW IMAGE ADDED plot_08_distribution_of_loanamount.png ')
plt.close()


plt.figure(figsize=(10, 4))

plt.subplot(1, 2, 1)
sns.histplot(df['Credit_History'], kde=True, bins=3, color='lightblue')
plt.title('Distribution of Credit_History')

plt.subplot(1, 2, 2)
sns.boxplot(x=df['Credit_History'], color='palegreen')
plt.title('Boxplot of Credit_History')

plt.tight_layout()
plt.savefig(os.path.join('charts_and_plots', 'plot_09_distribution_of_credit_history.png'))
print('NEW IMAGE ADDED plot_09_distribution_of_credit_history.png ')
plt.close()


plt.figure(figsize=(10, 6))
corr_matrix = df.corr(numeric_only=True)

sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt=".2f", linewidths=0.5)
plt.title('Correlation Matrix of Numerical Features')
plt.xticks(rotation=0)
plt.yticks(rotation=0)
plt.tight_layout()
plt.savefig(os.path.join('charts_and_plots', 'plot_10_correlation_matrix_of_numerical_features.png'))
print('NEW IMAGE ADDED plot_10_correlation_matrix_of_numerical_features.png ')
plt.close()


plt.figure(figsize=(8, 6))
plt.scatter(df['ApplicantIncome'], df['LoanAmount'], alpha=0.5)
plt.xlabel('Applicant Income')
plt.ylabel('Loan Amount')
plt.title('Scatterplot Applicant Income vs Loan Amount')
plt.savefig(os.path.join('charts_and_plots', 'plot_11_scatterplot_applicant_income_vs_loan_amount.png'))
print('NEW IMAGE ADDED plot_11_scatterplot_applicant_income_vs_loan_amount.png ')
plt.close()


ax = sns.countplot(x='Loan_Status', hue='Loan_Status', data=df, palette='coolwarm', legend=False)
plt.title('Loan Approval Status Count')
plt.xticks([0, 1], ['Approved (Y)', 'Rejected (N)'])

# Add value labels on bars
for p in ax.patches:
    ax.annotate(f'{p.get_height()}', (p.get_x() + p.get_width() / 2, p.get_height()-10),
                ha='center', va='top')

plt.savefig(os.path.join('charts_and_plots', 'plot_12_loan_approval_status_count.png'))
print('NEW IMAGE ADDED plot_12_loan_approval_status_count.png ')
plt.close()


categorical_cols = ['Gender', 'Married', 'Education', 'Self_Employed', 'Property_Area']

for i, col in enumerate(categorical_cols, start=13):
    fig, axes = plt.subplots(1, 2, figsize=(14, 4))

    sns.countplot(x=col, hue='Loan_Status', data=df, palette='pastel', ax=axes[0])
    axes[0].set_title(f'{col} vs Loan Status')
    axes[0].set_ylabel('Count')

    for p in axes[0].patches:
        h = p.get_height()
        axes[0].annotate(f'{h}\n{100 * h / len(df):.1f}%', (p.get_x() + p.get_width() / 2, h - 5),
                         ha='center', va='top', fontsize=9)

    df[col].value_counts().plot.pie(autopct='%1.1f%%', ax=axes[1], colors=sns.color_palette('pastel'))
    axes[1].set_title(f'{col} Distribution')
    axes[1].set_ylabel('')

    plt.tight_layout()
    plt.savefig(f'charts_and_plots/plot_{i}_{col}_vs_loan_status.png')
    print(f'NEW IMAGE ADDED plot_{i}_{col}_vs_loan_status.png')
    plt.close()



numerical_cols = ['ApplicantIncome', 'CoapplicantIncome', 'LoanAmount', 'Credit_History']

for i, col in enumerate(numerical_cols, start=18):
    plt.figure(figsize=(6, 4))
    sns.boxplot(data=df, x='Loan_Status', y=col, palette='Set3')
    plt.title(f'{col} vs Loan Status')
    plt.xlabel('Loan Status (N = Rejected, Y = Approved)')
    plt.tight_layout()
    plt.savefig(f'charts_and_plots/plot_{i}_{col}_vs_loan_status.png')
    print(f'NEW IMAGE ADDED plot_{i}_{col}_vs_loan_status.png')
    plt.close()