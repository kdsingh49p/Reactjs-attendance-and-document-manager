import { React, Component, useState, useEffect, useCallback } from "react";
import graphimg from "../../../assets/images/graph.PNG";
import { ActionNames, createAction } from "../../../services";
import "./CheckinCheckout.css";
import { useSelector } from "react-redux";
var moment = require('moment-timezone');
moment().tz("Africa/Casablanca").format();
var a = moment.tz(new Date(), "Africa/Casablanca");

const CheckinCheckout = () => {
  const [stats, setStats] = useState([]);
  const [activeCard, setActiveCard] = useState(1);
  const [todayAttendance, setTodayAttendance] = useState(false);

  

  const searchTodayAttendance = useCallback(async () => {
    try {
      let search = { };
      const fetching = createAction(ActionNames.GET_TODAY_ATTENDANCE, search);
      const resp_data = fetching.payload;
      resp_data.then((resp) => {
        const data = resp.data;
        if(data.status=='no_data_found'){
            setActiveCard(1);
        }else if(data.status=='success'){
            if(data.data.checkout_time==null){
                setTodayAttendance(data.data);
                setActiveCard(3);
                countUpFromTime("Jan 1, 2014 "+data.data?.checkin_time, "countup1")
            } else if (data.data.checkout_time!=null){
                setTodayAttendance(data.data);
                setActiveCard(4);
            }
        }
         
      });
    } catch (e) {
      console.log(e);
    }
  });

  const checkIn = useCallback(async () => {
    try {
      let search = { };
      const fetching = createAction(ActionNames.SET_TODAY_CHECKIN, search);
      const resp_data = fetching.payload;
      resp_data.then((resp) => {
        const data = resp.data;
        if(data.status=='success'){
            setTodayAttendance(data.data)

            setActiveCard(2);
        }
      });
    } catch (e) {
      console.log(e);
    }
  });

  const checkOut = useCallback(async () => {
    try {
      let search = { };
      const fetching = createAction(ActionNames.SET_TODAY_CHECKOUT, search);
      const resp_data = fetching.payload;
      resp_data.then((resp) => {
        const data = resp.data;
        if(data.status=='success'){
            setTodayAttendance(data.data)
            setActiveCard(4);
        }
      });
    } catch (e) {
      console.log(e);
    }
  });
  function countUpFromTime(countFrom, id) {

    countFrom = new Date(countFrom).getTime();
    var now = moment.tz(new Date(), "Africa/Casablanca").format("HH:mm:ss");
    now = new Date("Jan 1, 2014 "+ now)
    var countFrom = new Date(countFrom),
        timeDifference = (now - countFrom);
    var secondsInADay = 60 * 60 * 1000 * 24,
        secondsInAHour = 60 * 60 * 1000;
    // now = new Date(now);
    var days = Math.floor(timeDifference / (secondsInADay) * 1);
    var hours = Math.floor((timeDifference % (secondsInADay)) / (secondsInAHour) * 1);
    var mins = Math.floor(((timeDifference % (secondsInADay)) % (secondsInAHour)) / (60 * 1000) * 1);
    var secs = Math.floor((((timeDifference % (secondsInADay)) % (secondsInAHour)) % (60 * 1000)) / 1000 * 1);
  
    var idEl = document.getElementById(id);
    // console.log(idEl.getElementsByClassName('hours'), idEl.getElementsByClassName('minutes'))
    if(idEl && idEl.getElementsByClassName('hours').length && idEl.getElementsByClassName('minutes').length){
        // idEl.getElementsByClassName('days')[0].innerHTML = days;
        idEl.getElementsByClassName('hours')[0].innerHTML = hours;
        idEl.getElementsByClassName('minutes')[0].innerHTML = mins;
        // idEl.getElementsByClassName('seconds')[0].innerHTML = secs;
    
        clearTimeout(countUpFromTime.interval);
        countUpFromTime.interval = setTimeout(function(){ countUpFromTime(countFrom, id); }, 1000);
    }

  }

  const { user_obj } = useSelector((state) => {
    return {
      user_obj: state.authentication.user?.user_obj,
    };
  });
  useEffect(() => {
    searchTodayAttendance()
  }, []);

  return (
    <>
      <div className="admin-card">
        <div className="row">
          <div className="col-md-12">
            <div className="admin-card-header user-manager-header">
              <h1>Checkin / Checkout</h1>
            </div>
          </div>
        </div>
        <div className="row table-row" id="countup1">
            {
                (activeCard === 1) && 
                    (
                    <div className="col-md-4 offset-md-4">
                        <div className="card cstm-card" style={{ width: "18rem" }}>
                        <div className="card-header no-border cstm-card-header">
                            <span className="name_circle">{user_obj?.first_name.charAt(0)}{user_obj?.last_name.charAt(0)}</span>
                        </div>
                        <div className="card-body cstm-card-body">
                            <h5 className="card-title">Welcome {user_obj?.first_name}!</h5>
                            <button type="button" onClick={() => checkIn()} className="btn btn-primary">
                            Checkin <i class="bx bx-log-in-circle cstm-icon-size"></i>
                            </button>
                            <p className="card-text cstm-card-text">Click to checkin</p>
                        </div>
                        </div>
                    </div>
                    )
                }
                {
                    (activeCard === 2) &&
                    (
                        <div className="col-md-4 offset-md-4">
                            <div className="card cstm-card" style={{ width: "18rem" }}>
                            <div className="card-header no-border cstm-card-header">
                                <span className="name_circle">{user_obj?.first_name.charAt(0)}{user_obj?.last_name.charAt(0)}</span>
                            </div>
                            <div className="card-body cstm-card-body">
                                <h5 className="card-title">Welcome {user_obj?.first_name}!</h5>
                
                                <p className="card-text cstm-card-text">
                                Checked in at <strong>{todayAttendance?.checkin_time}</strong>
                                </p>
                                <button type="button" onClick={() => {setActiveCard(3);  
                                    setTimeout(function(){ 
                                        // countUpFromTime(countFrom, id); 
                                        countUpFromTime("Jan 1, 2014 "+todayAttendance?.checkin_time, "countup1")
                                    }, 1000)
                                    
                                    
                                    }} className="btn btn-success">
                                OK
                                </button>
                            </div>
                            </div>
                        </div>
                    )
                }
                {
                    (activeCard === 3) &&
                    (
                        <div className="col-md-4 offset-md-4">
                            <div className="card cstm-card" style={{ width: "18rem" }}>
                            <div className="card-header no-border cstm-card-header">
                                <span className="name_circle">{user_obj?.first_name.charAt(0)}{user_obj?.last_name.charAt(0)}</span>
                            </div>
                            <div className="card-body cstm-card-body">
                            <p className="card-text cstm-card-text">
                                <strong>{user_obj?.first_name} want to checkout ?</strong>
                                </p>
                                {/* <h5 className="card-title">Welcome !</h5> */}
                                <p className="card-text cstm-card-text">
                                Today work hours <strong> <span className="hours"></span>:<span className="minutes"></span></strong>
                                </p>
                                

                                
                                
                                <button type="button" onClick={() => {checkOut()}} className="btn btn-warning">
                                Checkout <i class="bx bx-log-out-circle cstm-icon-size"></i>
                                </button>
                                <p className="card-text cstm-card-text">
                                Click to checkout
                                </p>
                                
                            </div>
                            </div>
                        </div>
                    )
                }
                {
                    (activeCard === 4) &&
                    (
                        <div className="col-md-4 offset-md-4">
                            <div className="card cstm-card" style={{ width: "18rem" }}>
                            <div className="card-header no-border cstm-card-header">
                                <span className="name_circle">{user_obj?.first_name.charAt(0)}{user_obj?.last_name.charAt(0)}</span>
                            </div>
                            <div className="card-body cstm-card-body">
                                <h5 className="card-title">Goodbye {user_obj?.first_name}!</h5>
                                <p><strong>Have a good evening</strong></p>
                                <p className="card-text cstm-card-text">
                                Checked out at <strong>{todayAttendance?.checkout_time} <br />{todayAttendance?.total_hours_worked2}</strong>
                                </p>
                                
                                <button type="button" className="btn btn-light">
                                Good Bye
                                </button>
                            </div>
                            </div>
                        </div>
                    )
                }
          
          
          
          
        </div>

        {/* <div className="row">
                        <div className="col-xl-4 col-lg-6 col-sm-4">
                            
                        </div>
                        
                        <div className="col-xl-4 col-lg-6 col-sm-4">
                            <div className="stat-div">
                                <i class='bx bxs-log-out-circle' ></i>
                                <div className="stat">
                                    <h3>0</h3>
                                    <p>New Subscriptions</p>
                                </div>
                            </div>
                        </div>
                    </div> */}
      </div>
      {/* <div className="admin-card">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="admin-card-header">
                                <h1>Latest Stats</h1>
                                <span className="admin-header-icon"><i className='bx bx-info-circle'></i></span>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                             <div style={{ display: 'flex',flexWrap:"wrap", maxWidth: 10000 }}>
                                 <div class="chart-div-btn"> 
                                     <button type="button" onClick={() => setChartPeriodType('all')} className={chartPeriodType=='all' ? 'active-chart' : ''}>All time</button>
                                     <button type="button" onClick={() => setChartPeriodType('year')} className={chartPeriodType=='year' ? 'active-chart' : ''}>This year</button>
                                     <button type="button" onClick={() => setChartPeriodType('week')} className={chartPeriodType=='week' ? 'active-chart' : ''}>This week</button>
                                     <button type="button" onClick={() => setChartPeriodType('today')} className={chartPeriodType=='today' ? 'active-chart' : ''}>Today</button>
                                 </div>
                                 {
                                     (stats && stats.stats) &&
                                     <Chart
                                        width={'100%'}
                                        height={350}
                                        chartType="ColumnChart"
                                        loader={<div>Loading Chart</div>}
                                        data={stats.stats}
                                        options={{
                                        title: '',
                                        hAxis: {
                                            // title: 'Total Population',
                                            minValue: 0,
                                        },
                                        seriesType: 'bars',
                                        series: {5: {type: 'line'}},
                                        // vAxis: {
                                        //     title: 'City',
                                        // },
                                        }}
                                        // legendToggle
                                    />
                                 }
                                
                                </div>
                        </div>
                    </div>
                </div> */}
    </>
  );
};

export default CheckinCheckout;
