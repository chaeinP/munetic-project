import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Contexts from '../../context/Contexts';
import palette from '../../style/palette';
import { LessonWriteData } from '../../types/lessonData';
import Input, { InputBox } from '../common/Input';
import Select from '../common/Select';
import * as LessonAPI from '../../lib/api/lesson';
import * as ProfileAPI from '../../lib/api/profile';
import * as CategoryAPI from '../../lib/api/category';
import { UserDataType } from '../../types/userData';
import { CategoryDataType } from '../../types/categoryData';

const Container = styled.div`
  margin: 10px 10px 64px 10px;
  background-color: ${palette.green};
  padding: 15px 20px;
  font-size: 17px;
  font-weight: bold;
  color: ${palette.darkBlue};
  height: calc(100vh + 56px);
  .infoName {
    margin-top: 15px;
  }
`;

const StyledTitleInput = styled(Input)`
  margin-top: 10px;
  height: 35px;
  width: 100%;
  padding-left: 10px;
  color: ${palette.grayBlue};
  font-size: 20px;
  border: none;
  border-bottom: 1px solid ${palette.grayBlue};
`;

const IntroContent = styled.div`
  margin-top: 20px;
  font-weight: bold;
  color: ${palette.grayBlue};
  font-size: 16px;
  .introContent {
    width: 100%;
    height: 450px;
    margin: 10px 0;
    padding: 15px 15px;
    border-radius: 5px;
    border: none;
    background-color: white;
    font-weight: normal;
    font-size: 16px;
    outline: none;
    resize: none;
  }
`;

export default function ClassWrite() {
  const classId = useParams().id;

  const navigate = useNavigate();
  const { state, actions } = useContext(Contexts);
  const [userData, setUserData] = useState<UserDataType>();
  const [categoryData, setCategoryData] = useState<string[]>();
  const [classInfo, setClassInfo] = useState<LessonWriteData>({
    title: '',
    category: undefined,
    location: '',
    price: 10000,
    minute_per_lesson: 30,
    content: '',
  });
  const { title, category, price, location, minute_per_lesson, content } =
    classInfo;

  const onChangeInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { value, name } = e.target;
    if (name === 'price' || name === 'minute_per_lesson') {
      setClassInfo({
        ...classInfo,
        [name]: parseInt(value),
      });
    } else {
      setClassInfo({
        ...classInfo,
        [name]: value,
      });
    }
  };

  const validateWriteForm = () => {
    if (!title || !category || !price || !location || !minute_per_lesson) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (state.write) {
      actions.setValidationMode(true);
      if (validateWriteForm()) {
        let madeClassId;
        if (classId) {
          LessonAPI.editLessonById(Number(classId), classInfo)
            .then(res => {
              madeClassId = res.data.data.lesson_id;
              actions.setWrite(false);
              navigate(`/lesson/class/${madeClassId}`, { replace: true });
            })
            .catch(e => {
              console.log(e);
            });
        } else {
          LessonAPI.postLesson(Number(userData?.id), classInfo)
            .then(res => {
              madeClassId = res.data.data.lesson_id;
              actions.setWrite(false);
              navigate(`/lesson/class/${madeClassId}`, { replace: true });
            })
            .catch(e => {
              console.log(e);
            });
        }
      }
      actions.setWrite(false);
    }
  }, [state]);

  useEffect(() => {
    return () => {
      actions.setValidationMode(false);
    };
  }, []);

  useEffect(() => {
    async function getMyProfile() {
      try {
        const userProfile = await ProfileAPI.getMyProfile();
        setUserData(userProfile.data.data);
      } catch (e) {
        console.log(e, '??? ???????????? ???????????? ???????????????.');
      }
    }
    async function getLessonById(id: string) {
      try {
        const res = await LessonAPI.getLesson(Number(id));
        setClassInfo(res.data.data.editable);
      } catch (e) {
        console.log(e, 'id??? ????????? ???????????? ???????????????.');
      }
    }
    getMyProfile();
    if (classId) {
      getLessonById(classId);
    }
  }, [classId]);

  useEffect(() => {
    async function getCategory() {
      try {
        const res = await CategoryAPI.getMyProfile();
        const categoryLists: string[] = [];
        res.data.data.map((category: CategoryDataType) =>
          categoryLists.push(category.name),
        );
        setCategoryData(categoryLists);
      } catch (e) {
        console.log(e, '??????????????? ???????????? ???????????????.');
      }
    }
    getCategory();
  }, []);

  return (
    <Container>
      <StyledTitleInput
        name="title"
        placeholder="??????"
        value={title}
        isValid={!!title}
        onChange={onChangeInput}
      />
      <Select
        title="????????????"
        options={categoryData}
        value={category}
        name="category"
        disabledOptions={['????????????']}
        defaultValue="????????????"
        onChange={onChangeInput}
        isValid={!!category}
        errorMessage="??????????????? ???????????????."
      />
      <div className="infoName">?????? ?????? ??????</div>
      <InputBox
        inputName="??????"
        type="number"
        name="price"
        value={price}
        isValid={!!price}
        onChange={onChangeInput}
      />
      <InputBox
        inputName="?????????"
        isReadOnly
        useValidation={false}
        value={userData?.phone_number ? userData.phone_number : ''}
      />
      <InputBox
        inputName="??????"
        isReadOnly
        useValidation={false}
        value={userData?.gender ? userData.gender : ''}
      />
      <InputBox
        inputName="??????"
        name="location"
        value={location}
        isValid={!!location}
        onChange={onChangeInput}
      />
      <InputBox
        inputName="????????? ?????? ??????"
        type="number"
        name="minute_per_lesson"
        value={minute_per_lesson}
        isValid={!!minute_per_lesson}
        onChange={onChangeInput}
      />
      <IntroContent>
        <div className="introTitle">??????</div>
        <textarea
          name="content"
          className="introContent"
          placeholder="????????? ??????????????????."
          value={content}
          onChange={onChangeInput}
        />
      </IntroContent>
    </Container>
  );
}
