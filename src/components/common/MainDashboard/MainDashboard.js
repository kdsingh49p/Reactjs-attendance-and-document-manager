import {React, Component, useState, useEffect, useCallback} from "react";
import graphimg from "../../../assets/images/graph.PNG"
import { ActionNames, createAction } from "../../../services";
import "./MainDashboard.css"
import Chart from "react-google-charts";
import { useSelector } from "react-redux";
import { capitalize } from "@material-ui/core";
import { useHistory } from "react-router";

 
const MainDashboard = () => {
    const [stats, setStats] = useState([]);
    const [chartPeriodType, setChartPeriodType] = useState('all');
    const history = useHistory();

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
                    <div className="admin-card-header">
                        <h5>Hi <span style={{textTransform: "capitalize"}}>{user_obj.first_name}</span>, Welcome to control panel</h5>
                        <span className="admin-header-icon"><i className='bx bx-info-circle'></i></span>
                    </div>
                    <div className="row main-dashboar-card-row">
                        <div className="col-md-6">
                            <div className="icon-box-container">
                                <div className="icon-box"  onClick={() => {history.push('/common/dashboard')}}>
                                    <i class='bx bxs-calendar'></i>
                                </div> 
                            </div>
                       </div>
                        <div className="col-md-6">
                            <div className="icon-box-container">
                                <div className="icon-box"  onClick={() => {history.push('/documents/dashboard')}}>
                                <i class='bx bxs-file-doc'></i>
                                </div> 
                            </div>
                            </div> 
                    </div>
                   
                </div>
                
                
            </>
        );
    }


export default MainDashboard;