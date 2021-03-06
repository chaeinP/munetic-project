import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from './common/Button';
import * as Auth from '../lib/api/auth';
import client from '../lib/api/client';

const Container = styled.div`
  margin: 30px 0px;
  width: 100%;
  .homeButtonWrapper {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
  .homeFindButton {
    width: 40%;
    height: 40%;
  }
  .homeRegisterButton {
    width: 40%;
    height: 40%;
  }
`;

export default function Home() {
  const [loggedUser, setLoggedUser] = useState(localStorage.getItem('user'));

  const navigate = useNavigate();

  const onClickLogin = () => {
    navigate('/auth/login');
  };

  const onClickLogout = async () => {
    try {
      await Auth.logout();
      try {
        client.defaults.headers.common['Authorization'] = '';
        localStorage.removeItem('user');
      } catch (e) {
        console.log(e, 'localStorage is not working');
      }
      setLoggedUser(localStorage.getItem('user'));
    } catch (e) {
      console.log(e, '로그아웃 실패');
    }
  };

  const onClickSignup = () => {
    navigate('/auth/register');
  };
  const onClickSignupTutor = () => {
    navigate('/auth/register?tutor=tutor');
  };

  return (
    <Container>
      <div className="homeButtonWrapper">
        <div className="homeFindButton">
          <Button to="/lesson/category">레슨 찾기</Button>
        </div>
        <div className="homeRegisterButton">
          {loggedUser ? (
            <Button to="/lesson/manage">레슨 등록</Button>
          ) : (
            <Button to="/auth/register?tutor=tutor">
              레슨 등록(선생님 계정 필요)
            </Button>
          )}
        </div>
      </div>
      <button onClick={loggedUser ? onClickLogout : onClickLogin}>
        {loggedUser ? '로그아웃' : '로그인'}
      </button>
      <button onClick={onClickSignup}>학생 회원가입</button>
      <button onClick={onClickSignupTutor}>튜터 회원가입</button>
    </Container>
  );
}
