FROM python:3.11

EXPOSE 8000

RUN pip3 install Flask scikit-learn==1.2.1 pandas pydantic matplotlib

COPY . .

RUN echo "python script.py" >> start.sh


CMD ["sh", "start.sh"]