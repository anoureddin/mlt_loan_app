from django.db import models


class LoanRequest(models.Model):
    GENDER_CHOICES = [
        ("Male", "Male"),
        ("Female", "Female"),
    ]
    MARRIED_CHOICES = [
        ("Yes", "Yes"),
        ("No", "No"),
    ]
    DEPENDENT_CHOICES = [
        ("0", "0"),
        ("1", "1"),
        ("2", "2"),
        ("3+", "3 or more"),
    ]
    EDUCATION_CHOICES = [
        ("Graduate", "Graduate"),
        ("Not Graduate", "Not Graduate"),
    ]
    SELF_EMPLOYED_CHOICES = [
        ("Yes", "Yes"),
        ("No", "No"),
    ]
    PROPERTY_AREA_CHOICES = [
        ("Urban", "Urban"),
        ("Rural", "Rural"),
        ("Semiurban", "Semiurban"),
    ]

    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    married = models.CharField(max_length=10, choices=MARRIED_CHOICES)
    dependents = models.CharField(max_length=10, choices=DEPENDENT_CHOICES)
    education = models.CharField(max_length=20, choices=EDUCATION_CHOICES)
    self_employed = models.CharField(max_length=10, choices=SELF_EMPLOYED_CHOICES)
    applicant_income = models.FloatField()
    coapplicant_income = models.FloatField()
    loan_amount = models.FloatField()
    loan_amount_term = models.FloatField()
    credit_history = models.FloatField()
    property_area = models.CharField(max_length=20, choices=PROPERTY_AREA_CHOICES)
    prediction = models.CharField(max_length=1, null=True)  # Y or N
    prediction_probability = models.CharField(max_length=10, null=True)
