import { React, Component, useState, useCallback, useEffect } from "react";

import "./index.css";
import user from "../../../assets/images/avatar.png";
import user2 from "../../../assets/images/r.png";
import { ActionNames, createAction } from "../../../services";
import ReactPaginate from "react-paginate";
import { createNotification } from "../../../helpers/notifications";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { BASE_PATH_BLOGS, BASE_PATH_USERS } from "../../../helpers/UploadDirectory";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";

const DailyReport = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [checks, setChecks] = useState({});
  const [searchText, setSearchText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const [allCheck, setAllCheck] = useState(false);
  const [orderBy, setOrderBy] = useState({});
  const [startDate, setStartDate] = useState(new Date());

  const modalStyles = {
    background: "black",
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "10px",
      padding: "0",
    },
  };
  var subtitle;

  const [modalData, setModalData] = useState({
    show: false,
    data: null,
  });

  function openModal(data_) {
    setModalData({
      show: true,
      data: data_,
    });
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setModalData({
      data: null,
      show: false,
    });
  }

  function changePaginate(paginate_data) {
    // setPage(page+1)
    setPage(paginate_data.selected + 1);
  }

  const searchData = useCallback(async () => {
    try {
      const search = { page: page, search: searchText, orderBy, date: startDate };
      const fetching = createAction(ActionNames.GET_DAILY_REPORT, search, false);
      const resp_data = fetching.payload;
      resp_data.then((resp) => {
          if(resp.data.records.length > 0){
            setLastPage(resp.data.paging.last);
          }else{
            setLastPage(0);
          }
        setData(resp.data.records);
      });
    } catch (e) {
      console.log(e);
    }
  });

  

  useEffect(() => {
    searchData();
  }, [page, orderBy, startDate]);

  useEffect(() => {
    setPage(1)
    searchData();
  }, [searchText]);

  useEffect(() => {
    const obj = {};
    if(allCheck){ 
      data.forEach((el) => {
        obj[el.id] = true;
      });
    }
    setChecks(obj);
  }, [allCheck])

  const { user_obj } = useSelector((state) => {
    return {
      user_obj: state.authentication.user?.user_obj,
    };
  });
  return (
    <>
     
      <div className="admin-card">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="admin-card-header user-manager-header">
                <h1>Daily Report</h1>
              </div>
            </div>
          </div>
          <div className="row search_actions_row"  style={{marginBottom: '10px'}}>
          {user_obj?.user_type  == 'admin' && (
            <div className="col-md-4" >
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Employee Name"
                  onKeyUp={(event) => {
                    if (event.target.value.length >= 2) {
                      setSearchText(event.target.value);
                    } else if (event.target.value.length == 0) {
                      setSearchText(event.target.value);
                    }
                  }}
                />
                <small style={{fontSize: '11px', color: 'gray'}}>Enter min 3 characters</small>
              </div>
            </div>
          )}
            
            <div className="col-md-4">
                <DatePicker className="form-control" selected={startDate} onChange={(date) => setStartDate(date)} />
            </div>
            <div className="col-md-4">

              
            </div>
            
          </div>
          <div className="row table-row">
            <div className="col-md-12 p-0">
              <div className="table-responsive">
                <table className="table admin-table">
                  <thead>
                    <tr>
                      <th>
                        <div className="td-wrap">
                            Sr.no.
                        </div>
                      </th>
                      <th><div className="td-wrap">Employee Name&nbsp;
											<div className="sort-wrap" onClick={
                                                 () => {
                                                    setOrderBy((prev) => ({
                                                        first_name: !orderBy.first_name,
                                                    }))
                                                 }
                                             }>
												<i className={`bx bxs-chevron-up ${ (orderBy.first_name!== undefined) ? (!orderBy?.first_name ? 'orderByActive' : 'orderByUnActive') : ''}`}></i>
												<i className={`bx bxs-chevron-down ${ (orderBy.first_name!== undefined) ? (orderBy?.first_name ? 'orderByActive' : 'orderByUnActive') : ''}`} ></i>
											</div></div>
                      </th>
						
                      <th><div className="td-wrap">Date&nbsp; 
											<div className="sort-wrap" onClick={
                                                 () => {
                                                    setOrderBy((prev) => ({
                                                        date: !orderBy.date,
                                                    }))
                                                 }
                                             }>
											  <i className={`bx bxs-chevron-up ${ (orderBy.date!== undefined) ? (!orderBy?.date ? 'orderByActive' : 'orderByUnActive') : ''}`}></i>
												<i className={`bx bxs-chevron-down ${ (orderBy.date!== undefined) ? (orderBy?.date ? 'orderByActive' : 'orderByUnActive') : ''}`} ></i>
											</div></div>
                      </th>
						
                      <th><div className="td-wrap">Checkin &nbsp;
                      <div className="sort-wrap" onClick={
                                                 () => {
                                                    setOrderBy((prev) => ({
                                                        checkin_time: !orderBy.checkin_time,
                                                    }))
                                                 }
                                             }>
												<i className={`bx bxs-chevron-up ${ (orderBy.checkin_time!== undefined) ? (!orderBy?.checkin_time ? 'orderByActive' : 'orderByUnActive') : ''}`}></i>
												<i className={`bx bxs-chevron-down ${ (orderBy.checkin_time!== undefined) ? (orderBy?.checkin_time ? 'orderByActive' : 'orderByUnActive') : ''}`} ></i>
											</div>
										    </div>
                      </th>
                      <th><div className="td-wrap">Checkout &nbsp;
                      <div className="sort-wrap" onClick={
                                                 () => {
                                                    setOrderBy((prev) => ({
                                                        checkout_time: !orderBy.checkout_time,
                                                    }))
                                                 }
                                             }>
												<i className={`bx bxs-chevron-up ${ (orderBy.checkout_time!== undefined) ? (!orderBy?.checkout_time ? 'orderByActive' : 'orderByUnActive') : ''}`}></i>
												<i className={`bx bxs-chevron-down ${ (orderBy.checkout_time!== undefined) ? (orderBy?.checkout_time ? 'orderByActive' : 'orderByUnActive') : ''}`} ></i>
											</div>
										    </div>
                      </th>	
                      
						
                      <th><div className="td-wrap">Total worked hours &nbsp;
                      <div className="sort-wrap" onClick={
                                                 () => {
                                                    setOrderBy((prev) => ({
                                                        total_hours_worked2: !orderBy.total_hours_worked2,
                                                    }))
                                                 }
                                             }>
                          <i className={`bx bxs-chevron-up ${ (orderBy.total_hours_worked2!== undefined) ? (!orderBy?.total_hours_worked2 ? 'orderByActive' : 'orderByUnActive') : ''}`}></i>
												  <i className={`bx bxs-chevron-down ${ (orderBy.total_hours_worked2!== undefined) ? (orderBy?.total_hours_worked2 ? 'orderByActive' : 'orderByUnActive') : ''}`} ></i>
                      </div></div></th>
						
                     
                    </tr>
                  </thead>
                  <tbody>
                    
                  
                    
                  {(data.length == 0) ? (<p className="required">no data available</p>) 
                  :
                        data.map((row, i) => {
                            return (
                                <tr key={i}>
                                    <td>
                                        {(page > 1) ? ((1 * (page-1)) + (i+1)) : (i+1) }
                                    </td>
                                    <td>{row.first_name } {row.last_name }</td>
                                    <td>{row.date2}</td>
                                    <td>{row.checkin_time}</td>
                                    <td>{row.checkout_time}</td>
                                    <td>{row.total_hours_worked2}</td>
                                    
                                    
                                </tr>
                            );
                        })}
                    
                    
                   
                  </tbody>
                </table>
              </div>
              <ReactPaginate
                previousLabel={<i className="bx bx-chevron-left"></i>}
                nextLabel={<i className="bx bx-chevron-right"></i>}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={lastPage}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={changePaginate}
                containerClassName={"pagination admin-pagination"}
                pageLinkClassName={"page-link"}
                pageClassName={"page-item"}
                activeClassName={"active-li"}
            />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DailyReport;
