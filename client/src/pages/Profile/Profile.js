import React, { useState, useEffect } from 'react'
import Card from "react-bootstrap/Card"
import Row from 'react-bootstrap/esm/Row'
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom'
import Spiner from "../../components/Spiner/Spiner"
import { deletefunc, singleUsergetfunc } from "../../services/Apis"
import { BASE_URL } from '../../services/helper'
import moment from "moment"
import "./profile.css"

const Profile = () => {

  const [userprofile, setUserProfile] = useState({});
  const [showspin, setShowSpin] = useState(true);
  const navigate = useNavigate();

  const { id } = useParams();

  const userProfileGet = async () => {
    const response = await singleUsergetfunc(id);
    if (response.status === 200) {
      setUserProfile(response.data);
    } else {
      console.log("error");
    }
  }

  //delete user
  const deleteUser = async (id) => {
    const response = await deletefunc(id);
    if (response.status === 200) {
      toast.success("User deleted successfully");
      navigate('/')
    } else {
      toast.error("error")
    }
  }


  useEffect(() => {
    userProfileGet();
    setTimeout(() => {
      setShowSpin(false)
    }, 1200)
  }, [id])
  return (
    <>
      {
        showspin ? <Spiner /> :
          <div className="container">
            {

            }
            <Card className='card-profile shadow col-lg-6 mx-auto mt-5'>
              <Card.Body>
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center">
                      <img src={`${BASE_URL}/uploads/${userprofile.profile}`} alt="img" />
                    </div>
                  </div>
                </Row>
                <div className='text-center'>
                  <h3>{userprofile.fname + " " + userprofile.lname}</h3>
                  <h4><i class="fa-solid fa-envelope email"></i>&nbsp;:- <span>{userprofile.email}</span> </h4>
                  <h5><i class="fa-solid fa-mobile"></i>&nbsp;:- <span>{userprofile.mobile}</span> </h5>
                  <h4><i class="fa-solid fa-person"></i>&nbsp;:- <span>{userprofile.gender}</span> </h4>
                  <h4><i class="fa-solid fa-location-pin location"></i>&nbsp;:- <span>{userprofile.location}</span> </h4>
                  <h4>Status&nbsp;:- <span>{userprofile.status}</span> </h4>
                  <h5><i class="fa-solid fa-calendar-days calendar"></i>&nbsp;Date Created&nbsp;:- <span>{moment(userprofile.datecreated).format("DD-MM-YYYY")}</span> </h5>
                  <h5> <i class="fa-solid fa-calendar-days calendar"></i>&nbsp;Date Updated&nbsp;:- <span>{moment(userprofile.dateupdated).format("DD-MM-YYYY ")}</span> </h5>
                </div>
                <div className='d-flex justify-content-between mt-5'>
                  <NavLink to={`/edit/${userprofile._id}`} className="text-decoration-none">
                          <i class="fa-solid fa-pen-to-square" style={{ color: "blue" }}></i> <span>Edit</span>
                        </NavLink>
                  <div onClick={() => deleteUser(userprofile._id)}>
                          <i class="fa-solid fa-trash" style={{ color: "red" }}></i> <span>Delete</span>
                        </div>
                </div>
              </Card.Body>
            </Card>
          </div>
      }

    </>
  )
}

export default Profile