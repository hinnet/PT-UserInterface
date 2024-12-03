import { useState, useEffect } from "react";
import { getTrainings } from "../trainingapi";
import { _ } from "lodash";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

export default function Chart() {

    const [trainings, setTrainings] = useState([]);

    useEffect(() => {
        handleFetch();
    }, []);

    const handleFetch = () => {
        getTrainings()
            .then((data) => {
                const trainings = data._embedded.trainings.map((training, index) => ({
                    id: index,
                    activity: training.activity.toLowerCase(),
                    ...training,
                }));

                const groupedActivities = _.groupBy(trainings, "activity");
                const summedGroups = _.mapValues(groupedActivities, (group) => _.sumBy(group, "duration"));

                const formattedData = Object.keys(summedGroups).map(activity => ({
                    activity, 
                    duration: summedGroups[activity]
                }));

                console.log(formattedData);
                setTrainings(formattedData);
            })
            .catch((err) => console.error(err));
    };

    return (
        <div style={{ display: "flex", alignContent: "center", justifyContent: "center"}}>
            <ResponsiveContainer width={"90%"} height={600}>
                <BarChart 
                    data={trainings}
                    margin={{
                        top: 50,
                        right: 30,
                        left: 20,
                        bottom: 5,
                        }}
                >
                    <XAxis dataKey="activity" />
                    <YAxis />
                    <Bar dataKey="duration" fill="orange" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};