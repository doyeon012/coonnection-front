import React, { useState, useEffect  } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiCall } from '../../utils/apiCall'; // apiCall 함수 임포트
import { API_LIST } from '../../utils/apiList'; // API_LIST 임포트
import { useNavigate } from 'react-router-dom';
import './SignUpPage.css';
import logo from '../../assets/cat_logo.jpg'; // 로고 이미지 경로
import profileImage from '../../assets/profile.jpg'; // 프로필 이미지 경로

const SignUpPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [interests, setInterests] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, error } = useSelector((state) => state.user);

    useEffect(() => {
        if (token) {
            navigate('/main'); // 이미 로그인되어 있는 경우 홈 페이지로 리디렉션
        }
    }, [token, navigate]);

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            // 비밀번호 확인
            alert('Passwords do not match');
            return;
        }
        const response = await apiCall(API_LIST.USER_SIGNUP, { username, password, name, email, interests });
        if (response.data) {
            navigate('/'); // 회원가입 성공 시 로그인 페이지로 이동
        }
    };

    const handleInterestChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setInterests([...interests, value]);
        } else {
            setInterests(interests.filter((interest) => interest !== value));
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <img src={logo} alt="명톡 로고" className="logo" />
                <img
                    src={profileImage}
                    alt="프로필 이미지"
                    className="profile-image"
                />
                <form onSubmit={handleSignUp} className="signup-form">
                    <div className="input-group">
                        <label htmlFor="username">아이디</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="아이디를 입력하세요"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="confirm-password">비밀번호 확인</label>
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="비밀번호를 확인하세요"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="name">이름</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="이름을 입력하세요"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">이메일</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="이메일을 입력하세요"
                            required
                        />
                    </div>
                    <div className="interests-container">
                        <label>관심사</label>
                        <div className="interests">
                            <label>
                                <input
                                    type="checkbox"
                                    name="interest"
                                    value="관심사1"
                                    onChange={handleInterestChange}
                                />
                                관심사1
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="interest"
                                    value="관심사2"
                                    onChange={handleInterestChange}
                                />
                                관심사2
                            </label>
                            {/* 관심사 추가 */}
                        </div>
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit" className="signup-button">
                        회원가입
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
