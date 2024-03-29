'use strict';

const https = require('https');
const helpers = require('../helpers');
const user = require('../../user');
const db = require('../../database');

const Career = module.exports;


Career.register = async (req, res) => {
    const userData = req.body;
    try {
        const userCareerData = {
            student_id: userData.student_id,
            major: userData.major,
            age: userData.age,
            gender: userData.gender,
            gpa: userData.gpa,
            extra_curricular: userData.extra_curricular,
            num_programming_languages: userData.num_programming_languages,
            num_past_internships: userData.num_past_internships,
        };

        const URL = `https://tbd-ml.fly.dev/api?data=${encodeURI(JSON.stringify(userCareerData))}`;

        const requestPromise = new Promise((resolve, reject) => {
            https.get(URL, (response) => {
                let data = '';
                response.on('data', (chunk) => {
                    data += chunk;
                });
                response.on('end', () => {
                    console.log(data);
                    resolve(JSON.parse(data));
                });
            }).on('error', (error) => {
                reject(error);
            });
        });

        const response = await requestPromise;
        console.log(response);

        if (response.result === -1) { throw new Error('invalid result, microservice error.'); }

        userCareerData.prediction = response.result;

        await user.setCareerData(req.uid, userCareerData);
        db.sortedSetAdd('users:career', req.uid, req.uid);
        res.json({});
    } catch (err) {
        console.log(err);
        helpers.noScriptErrors(req, res, err.message, 400);
    }
};
