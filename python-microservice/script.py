from flask import Flask, request
import json
import predict

app = Flask(__name__)


@app.route("/api")
def get_example():
    try:
        user_config = request.args.get("data")
        student = json.loads(user_config)
        result = int(predict.predict(student)["good_employee"])
        response = {"result": result}
    except Exception as e:
        print(e)
        response = {"result": -1}
    finally:
        return json.dumps(response)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, threaded=True)

