import pandas as pd
import joblib
from pydantic import BaseModel, Field
from pydantic.tools import parse_obj_as
import matplotlib.pyplot as plt
import numpy as np


class Student(BaseModel):
    student_id: str = Field(alias="Student ID")
    gender: str = Field(alias="Gender")
    age: str = Field(alias="Age")
    major: str = Field(alias="Major")
    gpa: str = Field(alias="GPA")
    extra_curricular: str = Field(alias="Extra Curricular")
    num_programming_languages: str = Field(alias="Num Programming Languages")
    num_past_internships: str = Field(alias="Num Past Internships")

    class Config:
        allow_population_by_field_name = True


class PredictionResult(BaseModel):
    good_employee: int


# Main Functionality
def predict(student):
    """
    Returns a prediction on whether the student will be a good employee
    based on given parameters by using the ML model

    Parameters
    ----------
    student : dict
        A dictionary that contains all fields in Student
    
    Returns
    -------
    dict
        A dictionary satisfying type PredictionResult, contains a single field
        'good_employee' which is either 1 (will be a good employee) or 0 (will
        not be a good employee)

    Example:
    {'Student ID': 0, 'Gender': 'F', 'Age': 21, 'Major': 'Statistics and Machine Learning', 'GPA': 2.83, 'Extra Curricular': 'Sorority', 'Num Programming Languages': 4, 'Num Past Internships': 1, 'Good Candidate': 0}

    """
    # Use Pydantic to validate model fields exist
    student = parse_obj_as(Student, student)

    clf = joblib.load("./model.pkl")

    student = student.dict(by_alias=True)
    query = pd.DataFrame(student, index=[0])
    prediction = clf.predict(query)

    return {"good_employee": prediction[0]}

