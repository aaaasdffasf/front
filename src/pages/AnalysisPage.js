import React, { useState, useContext, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { ImageContext } from '../context/ImageContext';
import { analyzeImage, similarProblem, similarProblem_text, similarProblemAnswer } from '../api/chatGPTApi';

function Analysis() {
  const { imageUrl, setImageUrl } = useContext(ImageContext); // ImageContext에서 이미지 URL 가져오기 및 업데이트
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMerged, setIsMerged] = useState(false);
  const [similarProblemText, setSimilarProblemText] = useState(null); // 비슷한 문제 텍스트 상태 추가
  const [similarProblemAnswerText, setSimilarProblemAnswerText] = useState(null); // 해설 및 정답 상태 추가

  // 이미지 분석 요청
  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const imageFile = imageUrl ? await fetch(imageUrl).then(res => res.blob()) : null;
      if (imageFile) {
        const result = await analyzeImage(imageFile);
        setAnalysisResult(result); // 분석 결과를 저장
      } else {
        throw new Error('이미지가 없습니다.');
      }
    } catch (error) {
      console.error('해설 요청 실패:', error);
      alert('해설을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 비슷한 유형 문제 생성
  const handleSimilarProblem = async () => {
    setLoading(true);
    try {
      if (imageUrl) { // 이미지가 있을 경우 similarProblem 호출
        const imageFile = await fetch(imageUrl).then(res => res.blob());
        const result = await similarProblem(imageFile);
        setSimilarProblemText(result); // 비슷한 문제 텍스트 저장
      } else if (similarProblemText) { // 텍스트가 있을 경우 similarProblem_text 호출
        const result = await similarProblem_text(similarProblemText);
        setSimilarProblemText(result); // 새로운 비슷한 문제 텍스트 저장
      } else {
        alert('이미지 또는 텍스트가 필요합니다.');
      }
  
      setImageUrl(null); // 기존 이미지 제거
      setAnalysisResult(null); // 기존 분석 결과 초기화
    } catch (error) {
      console.error('비슷한 유형 문제 요청 실패:', error);
      alert('비슷한 유형 문제를 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 해설 및 정답을 받아오는 함수
  const handleSimilarProblemAnswer = async () => {
    setLoading(true);
    try {
      const answerResult = await similarProblemAnswer(similarProblemText); // 비슷한 유형 문제 해설 요청
      setSimilarProblemAnswerText(answerResult); // 해설 및 정답 텍스트 저장
      //setSimilarProblemText(null); // 비슷한 문제 텍스트 초기화
      console.log(answerResult);
    } catch (error) {
      console.error('해설 및 정답 요청 실패:', error);
      alert('해설 및 정답을 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 이미지 URL이 변경될 때마다 handleAnalyze 호출
  useEffect(() => {
    if (imageUrl) {
      handleAnalyze(); // 처음 로드될 때 이미지 분석을 요청
    }
  }, [imageUrl]);

  // handleToggleAndAction 함수: 버튼 클릭에 맞는 함수 호출
  const handleToggleAndAction = () => {
    setIsMerged(!isMerged); // 상태 변경 (화면에서 보여줄 것인지 아닌지)

    if (isMerged) {
      handleSimilarProblemAnswer(); // "해설 보기" 클릭 시 해설 불러오기
    } else {
      handleSimilarProblem(); // "비슷한 유형 문제 풀기" 클릭 시 문제 불러오기
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <TopNav />

        <div style={{ backgroundColor: '#F3F6FE', minHeight: '91vh', paddingTop: '2px', display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              height: '50vh',
              flex: 1,
              backgroundColor: 'white',
              borderRadius: 3,
              textAlign: 'center',
              p: 1,
              mx: 2,
              my: 2,
              position: 'relative',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
              <Button onClick={handleToggleAndAction} variant="contained">
                {isMerged ? '해설 보기' : '비슷한 유형 문제 풀기'}
              </Button>
            </Box>

            <Box
              sx={{
                marginTop: '10px',
                height: '1000px',
                display: 'flex',
                flexDirection: isMerged ? 'column' : 'row',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  backgroundColor: '#e0e0e0',
                  borderRadius: isMerged ? '3px' : '3px 0 0 3px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  p: 1,
                }}
              >
                <Box sx={{ marginTop: 2, backgroundColor: '#f0f0f0', padding: 2, borderRadius: 2 }}>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Uploaded"
                      style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
                    />
                  ) : similarProblemText ? (
                    <Typography style={{ whiteSpace: 'pre-line' }}>
                      {similarProblemText}
                    </Typography>
                  ) : (
                    <Typography>비슷한 유형 문제가 여기에 표시됩니다.</Typography>
                  )}
                </Box>
              </Box>

              {!isMerged && (
                <Box
                  sx={{
                    flex: 1,
                    backgroundColor: '#d0d0d0',
                    borderRadius: '0 3px 3px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box sx={{ marginTop: 2, marginLeft: 2, marginRight: 2, backgroundColor: '#f0f0f0', padding: 2, borderRadius: 2 }}>
                    <Typography variant="h6">GPT 해설 및 정답</Typography>
                    {loading ? (
                      <Typography>Loading...</Typography>
                    ) : analysisResult ? (
                      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', textOverflow: 'ellipsis' }}>
                        {JSON.stringify(analysisResult, null, 2)} {/* 분석 결과 표시 */}
                      </pre>
                    // ) : similarProblemText ? (
                    //   <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', textOverflow: 'ellipsis' }}>
                    //     {similarProblemText} {/* 비슷한 문제 텍스트 표시 */}
                    //   </pre>
                    ) : similarProblemAnswerText ? (
                      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', textOverflow: 'ellipsis' }}>
                        {similarProblemAnswerText} {/* 해설 및 정답 표시 */}
                      </pre>
                    ) : (
                      <Typography>해설을 불러오는 중입니다.</Typography>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default Analysis;