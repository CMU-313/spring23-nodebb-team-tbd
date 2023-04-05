FROM python:3.11

EXPOSE 8000

RUN pip3 install Flask

RUN echo "python script.py" >> start.sh

COPY . .

CMD ["sh", "start.sh"]