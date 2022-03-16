import {React, Component, useState, useEffect, useCallback} from "react";
import graphimg from "../../../assets/images/graph.PNG"
import { ActionNames, createAction } from "../../../services";
import "./Dashboard.css"
import Chart from "react-google-charts";
import { useSelector } from "react-redux";
import { capitalize } from "@material-ui/core";

 
const Dashboard = () => {
    const [stats, setStats] = useState([]);
    const [chartPeriodType, setChartPeriodType] = useState('all');

    const searchStats = useCallback(async () => {
        
    try {
        let search = {type: chartPeriodType}
        const fetching = createAction(ActionNames.ADMIN_DASHBOARD, search);
        const resp_data = fetching.payload;
        resp_data.then((resp) => {
            setStats(resp.data);
        })
        

    } catch (e) {
        console.log(e);
    }
    });
    const { user_obj } = useSelector((state) => {
        return {
            user_obj: state.authentication.user?.user_obj,
        };
      });
    useEffect(() => {
        // searchStats()

    }, [chartPeriodType]);
      
        return (
            <>
                <div className="admin-card">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="admin-card-header">
                                <h5>Hi <span style={{textTransform: "capitalize"}}>{user_obj.first_name}</span>, Welcome to attendance software</h5>
                                <span className="admin-header-icon"><i className='bx bx-info-circle'></i></span>
                            </div>
                        </div>
                    </div>
                    
                </div>
                
                
            </>
        );
    }


export default Dashboard;