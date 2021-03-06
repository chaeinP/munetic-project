import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import palette from '../../style/palette';
import * as LessonAPI from '../../lib/api/lesson';
import { LessonData } from '../../types/lessonData';
import { Gender } from '../../types/enums';

const ClassContainer = styled.div`
  margin: 10px;
  background-color: ${palette.green};
`;

const ClassProfileWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${palette.darkBlue};
  .imgAndNickname {
    margin: 20px;
    display: flex;
    flex-direction: column;
  }
  .profileImg {
    width: 90px;
    height: 90px;
    border-radius: 50%;
  }
  .nickname {
    margin-top: 10px;
    text-align: center;
    font-size: large;
    font-weight: bold;
  }
  .sns {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 10px;
  }
`;

const ClassPhoneNumber = styled.div`
  padding: 15px 20px;
  font-size: 17px;
  font-weight: bold;
  color: ${palette.darkBlue};
  border-bottom: 1px solid ${palette.darkBlue};
  .phoneNumber {
    font-weight: normal;
    color: ${palette.grayBlue};
  }
`;

const ClassBasicInfo = styled.div`
  padding: 15px 20px;
  font-size: 17px;
  font-weight: bold;
  color: ${palette.darkBlue};
  border-bottom: 1px solid ${palette.darkBlue};
  .basicInfo {
    margin: 10px 15px 0px 5px;
  }
  .basicInfoDetail {
    display: flex;
    margin: 5px 0;
    font-size: 16px;
  }
  .basicInfoDetailTitle {
    flex: 1;
  }
  .basicInfoDetailValue {
    font-weight: normal;
    flex: 1.5;
    color: ${palette.grayBlue};
  }
`;

const ClassContent = styled.div`
  padding: 15px 20px;
  font-size: 17px;
  font-weight: bold;
  color: ${palette.darkBlue};
  border-bottom: 1px solid ${palette.darkBlue};
  .contentBox {
    margin: 10px 0;
    padding: 25px 15px;
    border-radius: 5px;
    background-color: white;
  }
  .contentText {
    font-weight: normal;
    font-size: 16px;
  }
`;

interface InfosType {
  ??????: string;
  '??????/??????': string;
  ??????: number;
  '????????? ??????': string;
  '?????? ??????': number;
}

interface RenderInfoProps {
  infos: InfosType;
}

const RenderInfo = ({ infos }: RenderInfoProps) => {
  const infoArray = [];
  for (const [key, value] of Object.entries(infos)) {
    infoArray.push({ title: key, answer: value });
  }
  return (
    <div className="basicInfo">
      {infos &&
        infoArray.map(info => (
          <div className="basicInfoDetail" key={info.title}>
            <span className="basicInfoDetailTitle">??? {info.title}</span>
            <span className="basicInfoDetailValue">{info.answer}</span>
          </div>
        ))}
    </div>
  );
};

export default function Class() {
  const classId = useParams().id;
  const [classInfo, setClassInfo] = useState<LessonData>({
    lesson_id: 0,
    tutor_id: 0,
    tutor_name: '',
    gender: Gender.Male,
    birth: '',
    phone_number: '',
    image_url: '',
    editable: {
      category: '',
      title: '',
      price: 0,
      location: '',
      minute_per_lesson: 0,
      content: '',
    },
  });

  const {
    image_url,
    tutor_id,
    tutor_name,
    birth,
    phone_number,
    gender,
    editable,
  } = classInfo;
  const { price, location, minute_per_lesson, content } = editable;

  const basicInfos = {
    ??????: birth,
    '??????/??????': location,
    ??????: price,
    '????????? ??????': gender,
    '?????? ??????': minute_per_lesson,
  };

  useEffect(() => {
    async function getLessonById(id: string) {
      try {
        const res = await LessonAPI.getLesson(Number(id));
        setClassInfo(res.data.data);
      } catch (e) {
        console.log(e, 'id??? ????????? ???????????? ???????????????.');
      }
    }
    if (classId) {
      getLessonById(classId);
    }
  }, [classId]);

  return (
    <ClassContainer>
      <ClassProfileWrapper>
        <div className="imgAndNickname">
          <img className="profileImg" src={image_url} alt="" />
          <div className="nickname">
            <Link to={`/profile/${tutor_id}`}>{tutor_name}</Link>
          </div>
        </div>
        <div className="sns">
          <div className="snsTop">
            <FavoriteBorderIcon />
            <BookmarkBorderIcon />
          </div>
          <div className="snsBottom">
            <InstagramIcon />
            <YouTubeIcon />
          </div>
        </div>
      </ClassProfileWrapper>
      <ClassPhoneNumber>
        ????????? : <span className="phoneNumber">{phone_number}</span>
      </ClassPhoneNumber>
      <ClassBasicInfo>
        ?????? ?????? ??????
        <RenderInfo infos={basicInfos} />
      </ClassBasicInfo>
      <ClassContent>
        ??????
        <div className="contentBox">
          <div className="contentText">{content}</div>
        </div>
      </ClassContent>
    </ClassContainer>
  );
}
