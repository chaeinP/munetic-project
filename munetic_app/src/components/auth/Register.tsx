import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import palette from '../../style/palette';
import Button from '../common/Button';
import { InputBox } from '../common/Input';
import Select from '../common/Select';
import * as AuthAPI from '../../lib/api/auth';
import Contexts from '../../context/Contexts';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { dayList, monthList, yearList } from '../../lib/staticData';
import { Account } from '../../types/enums';
import client from '../../lib/api/client';

const Container = styled.form`
  margin: 100px 30px 30px 30px;
  padding: 30px;
  border-radius: 10px;
  background-color: ${palette.green};
  .registerButton {
    margin-top: 20px;
  }
  .checkWrapper {
    display: flex;
    .checkInput {
      flex: 1 0 auto;
    }
    .checkBtn {
      flex-shrink: 0;
      font-size: 13px;
      color: ${palette.green};
      border: 0;
      border-radius: 5px;
      background-color: ${palette.grayBlue};
      margin: 10px 0px 0px 5px;
      line-height: 30px;
      height: 30px;
    }
  }
  .dupErrorMessage {
    text-align: center;
    color: ${palette.red};
    font-size: 14px;
    margin-top: 15px;
  }
`;

const SelectContainer = styled.div`
  display: flex;
  font-size: 15px;
  margin-top: 10px;
  .selectTitle {
    line-height: 35px;
    font-weight: bold;
    color: ${palette.grayBlue};
    flex: 1 0 auto;
    height: 30px;
  }
  .selectBirthTitle {
    line-height: 35px;
    font-weight: bold;
    color: ${palette.grayBlue};
    flex: 1 0 auto;
    height: 30px;
    margin-right: 18px;
  }
  .select {
    font-weight: normal;
    font-size: 15px;
    text-align: center;
  }
  .selectBirth {
    display: flex;
  }
  .selectYear {
    flex: 2;
    margin-left: 3px;
  }
  .selectMonth {
    flex: 1;
    margin-left: 3px;
  }
  .selectDay {
    flex: 1;
    margin-left: 3px;
  }
`;

const StyledButton = styled(Button)`
  height: 40px;
  border-radius: 5px;
  font-size: 18px;
  ::before {
    padding-top: 0%;
  }
`;

export default function Register() {
  const [getParams] = useSearchParams();
  const tutorParam = getParams.get('tutor');

  const { state, actions } = useContext(Contexts);
  const [registerInfo, setRegisterInfo] = useState({
    login_id: '',
    login_password: '',
    type: tutorParam ? Account.Tutor : Account.Student,
    nickname: '',
    name: '',
    email: '',
    birth: '',
    phone_number: '',
    gender: undefined,
  });

  const navigate = useNavigate();

  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [isValidId, setIsValidId] = useState(false);
  const [isValidNickname, setIsValidNickname] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [birthYear, setBirthYear] = useState<string | undefined>();
  const [birthMonth, setBirthMonth] = useState<string | undefined>();
  const [birthDay, setBirthDay] = useState<string | undefined>();
  const {
    login_id,
    login_password,
    nickname,
    name,
    email,
    phone_number,
    gender,
  } = registerInfo;

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { value, name } = e.target;
    if (name === 'login_id') {
      setIsValidId(false);
    } else if (name === 'nickname') {
      setIsValidNickname(false);
    } else if (name === 'email') {
      setIsValidEmail(false);
    } else if (name === 'phone_number') {
      const phone_number_form = /^01([0-9])-([0-9]{3,4})-([0-9]{4})$/;
      if (phone_number_form.test(value)) {
        setIsValidPhone(true);
      } else {
        setIsValidPhone(false);
      }
    }
    setRegisterInfo({
      ...registerInfo,
      [name]: value,
    });
  };

  const onChangeBirth = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    if (name === 'birthYear') {
      setBirthYear(value);
      setRegisterInfo({
        ...registerInfo,
        birth: `${value}-${birthMonth}-${birthDay}`,
      });
    } else if (name === 'birthMonth') {
      setBirthMonth(value);
      setRegisterInfo({
        ...registerInfo,
        birth: `${birthYear}-${value}-${birthDay}`,
      });
    } else {
      setBirthDay(value);
      setRegisterInfo({
        ...registerInfo,
        birth: `${birthYear}-${birthMonth}-${value}`,
      });
    }
  };

  const onChangePasswordConfirm = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setPasswordConfirm(e.target.value);
  };

  const validateSignupForm = () => {
    if (
      !login_id ||
      !login_password ||
      !passwordConfirm ||
      !nickname ||
      !name ||
      !gender ||
      !email ||
      !phone_number ||
      !birthYear ||
      !birthMonth ||
      !birthDay
    ) {
      return false;
    }
    if (login_password !== passwordConfirm) {
      return false;
    }
    if (!isValidId || !isValidNickname || !isValidEmail || !isValidPhone) {
      return false;
    }
    return true;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    actions.setValidationMode(true);
    if (validateSignupForm()) {
      try {
        await AuthAPI.signup(registerInfo);
        client.defaults.headers.common['Authorization'] = '';
        localStorage.removeItem('user');
        navigate('/auth/login');
      } catch (e) {
        console.log(e, '???????????? ??????');
      }
    }
  };

  const onClickCheckId = async (id: string) => {
    if (id) {
      try {
        await AuthAPI.isValidInfo(`login_id=${id}`);
        alert('??? ???????????? ????????? ??? ????????????!');
        setIsValidId(true);
      } catch (e) {
        alert('????????? ???????????? ???????????????.');
        console.log(e, '????????? ?????????!');
      }
    }
  };

  const onClickCheckNickname = async (nickname: string) => {
    if (nickname) {
      try {
        await AuthAPI.isValidInfo(`nickname=${nickname}`);
        alert('??? ???????????? ????????? ??? ????????????!');
        setIsValidNickname(true);
      } catch (e) {
        alert('????????? ???????????? ???????????????.');
        console.log(e, '????????? ?????????!');
      }
    }
  };

  const onClickCheckEmail = async (email: string) => {
    if (email) {
      try {
        await AuthAPI.isValidInfo(`email=${email}`);
        alert('??? ???????????? ????????? ??? ????????????!');
        setIsValidEmail(true);
      } catch (e) {
        alert('????????? ???????????? ???????????????.');
        console.log(e, '????????? ?????????!');
      }
    }
  };

  useEffect(() => {
    return () => {
      actions.setValidationMode(false);
      setIsValidId(false);
      setIsValidNickname(false);
      setIsValidEmail(false);
    };
  }, []);

  return (
    <Container onSubmit={onSubmit}>
      <div className="checkWrapper">
        <div className="checkInput">
          <InputBox
            inputName="?????????"
            name="login_id"
            value={login_id}
            onChange={onChange}
            isValid={!!login_id}
          />
        </div>
        <span className="checkBtn" onClick={() => onClickCheckId(login_id)}>
          ????????????
        </span>
      </div>
      <InputBox
        inputName="????????????"
        value={login_password}
        name="login_password"
        type="password"
        onChange={onChange}
        isValid={!!login_password}
      />
      <InputBox
        inputName="???????????? ??????"
        value={passwordConfirm}
        name="passwordConfirm"
        type="password"
        isValid={!!passwordConfirm && login_password === passwordConfirm}
        errorMessage="??????????????? ??????????????????."
        onChange={e => onChangePasswordConfirm(e)}
      />
      <div className="checkWrapper">
        <div className="checkInput">
          <InputBox
            inputName="?????????"
            value={nickname}
            name="nickname"
            isValid={!!nickname}
            onChange={onChange}
          />
        </div>
        <span
          className="checkBtn"
          onClick={() => onClickCheckNickname(nickname)}
        >
          ????????????
        </span>
      </div>
      <InputBox
        inputName="??????"
        value={name}
        name="name"
        isValid={!!name}
        onChange={onChange}
      />
      <SelectContainer>
        <span className="selectTitle">??????</span>
        <div className="select">
          <Select
            options={['Female', 'Male', 'Other']}
            value={gender}
            disabledOptions={['??????']}
            defaultValue="??????"
            name="gender"
            onChange={onChange}
            isValid={!!gender}
            errorMessage="????????? ???????????????."
          />
        </div>
      </SelectContainer>
      <SelectContainer>
        <span className="selectBirthTitle">????????????</span>
        <div className="selectBirth">
          <div className="selectYear">
            <Select
              options={yearList}
              value={birthYear}
              disabledOptions={['????????????']}
              defaultValue="????????????"
              name="birthYear"
              onChange={onChangeBirth}
              isValid={!!birthYear}
              errorMessage="??????????????? ???????????????."
            />
          </div>
          <div className="selectMonth">
            <Select
              options={monthList}
              value={birthMonth}
              disabledOptions={['???']}
              defaultValue="???"
              name="birthMonth"
              onChange={onChangeBirth}
              isValid={!!birthMonth}
              errorMessage="?????? ???????????????."
            />
          </div>
          <div className="selectDay">
            <Select
              options={dayList}
              value={birthDay}
              disabledOptions={['???']}
              defaultValue="???"
              name="birthDay"
              onChange={onChangeBirth}
              isValid={!!birthDay}
              errorMessage="?????? ???????????????."
            />
          </div>
        </div>
      </SelectContainer>
      <div className="checkWrapper">
        <div className="checkInput">
          <InputBox
            inputName="?????????"
            value={email}
            name="email"
            type="email"
            isValid={!!email}
            onChange={onChange}
          />
        </div>
        <span className="checkBtn" onClick={() => onClickCheckEmail(email)}>
          ????????????
        </span>
      </div>
      <InputBox
        inputName="????????? ??????"
        placeholder="ex) 010-0000-0000"
        value={phone_number}
        name="phone_number"
        isValid={!!phone_number && isValidPhone}
        onChange={onChange}
        errorMessage="????????? ????????? ????????? ??????????????????."
      />
      {state.validationMode &&
        (!isValidId || !isValidNickname || !isValidEmail) && (
          <div className="dupErrorMessage">??????????????? ????????????.</div>
        )}
      <div className="registerButton">
        <StyledButton type="submit">????????????</StyledButton>
      </div>
    </Container>
  );
}
