import React, {useState, useCallback, useEffect} from 'react';
import HomeNavbar from 'components/HomeNavbar';
import ProfileHeader from 'components/ProfileHeader';
import {Container, Row, Col, Button} from 'reactstrap';
import defaultProfileImg from 'assets/img/default_user.jpg';
import Footer from 'components/Footer';
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import DatePicker from 'reactstrap-date-picker';
import api from 'services/api';
import {getUser, setUser, setToken} from 'services/auth';
import {toast} from 'react-toastify';
import {getValidationErrors} from 'utils/ValidationErrors';

export default function Profile() {
  const [user] = useState(getUser());
  const [date, setDate] = useState(user.birthDate);
  const [formattedDate, setFormattedDate] = useState();

  const ProfileSchema = Yup.object().shape({
    name: Yup.string(),
    email: Yup.string(),
    birthDate: Yup.date(),
    oldPassword: Yup.string(),
    newPassword: Yup.string(),
    confirmNewPassword: Yup.string()
  });

  const handleChange = (value, formattedValue) => {
    setDate(value);
    setFormattedDate(formattedValue);
  };

  const updateProfile = async (profileUpdated) => {
    const response = await api.put('user/', profileUpdated);

    const {user} = response.data;
    setUser(JSON.stringify(user));
  };

  const handleSubmit = useCallback(
    async (data) => {
      try {
        await ProfileSchema.validate(data, {
          abortEarly: false
        });

        await updateProfile({
          name: data.name,
          email: data.email,
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
          confirmNewPassword: data.confirmNewPassword,
          birthDate: data.birthDate
        });

        toast.success('Profile Updated Successfully', {
          position: 'top-right',
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          let message = [];
          errors.map((error) => {
            message.push(error.message);
          });
        }
        toast.error(err.message, {
          position: 'top-right',
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true
        });
        return false;
      }
    },
    [updateProfile]
  );

  return (
    <>
      <HomeNavbar />
      <ProfileHeader />
      <div className='section profile-content'>
        <Container>
          <div className='owner'>
            <div className='avatar'>
              <img
                alt='...'
                className='img-circle img-no-padding img-reponsive'
                style={{
                  border: '2px solid #E62429',
                  width: '300px',
                  height: '150px'
                }}
                src={user.image ? user.image : defaultProfileImg}
              />
            </div>
            <div className='name'>
              <h4 className='title'>{user.name}</h4>
            </div>
          </div>
          <Row>
            <Col className='ml-auto mr-auto ' md='6'>
              <Formik
                initialValues={{
                  name: user.name,
                  email: user.email,
                  birthDate: user.birthDate,
                  oldPassword: '',
                  newPassword: '',
                  confirmNewPassword: ''
                }}
                validationSchema={ProfileSchema}
                onSubmit={handleSubmit}>
                {({errors, touched, setFieldValue}) => (
                  <Form>
                    <label>Name</label>
                    <Field
                      className='form-control'
                      placeholder='Name'
                      name='name'
                    />
                    {errors.name && touched.name ? (
                      <div style={{color: 'red'}}>{errors.name}</div>
                    ) : null}
                    <label>Email</label>
                    <Field
                      className='form-control'
                      placeholder='Email'
                      name='email'
                      type='email'
                    />
                    {errors.email && touched.email ? (
                      <div style={{color: 'red'}}>{errors.email}</div>
                    ) : null}
                    <label>Old Password</label>
                    <Field
                      className='form-control'
                      placeholder='Old Password'
                      name='oldPassword'
                      type='password'
                    />
                    {errors.oldPassword && touched.oldPassword ? (
                      <div style={{color: 'red'}}>{errors.oldPassword}</div>
                    ) : null}
                    <label>New Password</label>
                    <Field
                      className='form-control'
                      placeholder='New Password'
                      name='newPassword'
                      type='password'
                    />
                    {errors.newPassword && touched.newPassword ? (
                      <div style={{color: 'red'}}>{errors.newPassword}</div>
                    ) : null}
                    <label>Confirm New Password</label>
                    <Field
                      className='form-control'
                      placeholder='Confirm New Password'
                      name='confirmNewPassword'
                      type='password'
                    />
                    {errors.confirmNewPassword && touched.confirmNewPassword ? (
                      <div style={{color: 'red'}}>
                        {errors.confirmNewPassword}
                      </div>
                    ) : null}
                    <label>Birth Date</label>
                    <DatePicker
                      id='birthDate'
                      name='birthDate'
                      value={date}
                      onChange={(v, f) => {
                        handleChange(v, f);
                        setFieldValue('birthDate', v);
                      }}
                    />
                    {errors.birthDate && touched.birthDate ? (
                      <div style={{color: 'red'}}>{errors.birthDate}</div>
                    ) : null}
                    <br />
                    <Button
                      block
                      type='submit'
                      className='btn-round'
                      style={{backgroundColor: '#E62429'}}>
                      Update
                    </Button>
                  </Form>
                )}
              </Formik>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
}
