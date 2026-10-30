import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import CustomCalendar from "../Components/common/CustomCalendar";
import Button from "../Components/common/Button";
import BottomBar from "../Components/common/BottomBar";
import AxiosApi from "../api/AxiosApi";

/* ───────── 스타일 컴포넌트 ───────── */

const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 30px 20px 100px;
  box-sizing: border-box;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SessionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #334155;
  margin: 0;
`;

const SessionCard = styled.div`
  background: ${({ $isPassed }) => ($isPassed ? "#f1f5f9" : "#ffffff")};

  border: 2px solid
    ${({ $isSelected, $isPassed }) =>
      $isSelected ? "#c327eb" : $isPassed ? "#cbd5e1" : "#e2e8f0"};

  border-radius: 16px;
  padding: 20px;

  cursor: ${({ $isPassed }) => ($isPassed ? "not-allowed" : "pointer")};

  opacity: ${({ $isPassed }) => ($isPassed ? 0.6 : 1)};
  transition: all 0.2s ease-in-out;

  box-shadow: ${({ $isSelected }) =>
    $isSelected
      ? "0 4px 12px rgba(195, 39, 235, 0.15)"
      : "0 2px 8px rgba(0, 0, 0, 0.04)"};

  &:hover {
    border-color: ${({ $isPassed }) => ($isPassed ? "#cbd5e1" : "#c327eb")};
  }
`;

const TimeText = styled.div`
  font-size: 20px;
  font-weight: 800;

  color: ${({ $isSelected, $isPassed }) =>
    $isPassed ? "#94a3b8" : $isSelected ? "#c327eb" : "#1e293b"};

  margin-bottom: 10px;
`;

const SeatInfoList = styled.div`
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: #475569;
  margin-bottom: 8px;

  span strong {
    color: #0f172a;
  }
`;

const CastText = styled.div`
  font-size: 13px;
  color: #94a3b8;
`;

/* ───────── 메인 컴포넌트 ───────── */

const ReservationSelect = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // 기존 회차 목록 유지
  const sessionList = [
    {
      id: 1,
      time: "14:00",
      seats: { VIP: 2, R: 10, S: 12, A: 20 },
      casting: "최재림, 이해원, 송원근",
    },
    {
      id: 2,
      time: "19:30",
      seats: { VIP: 0, R: 5, S: 6, A: 14 },
      casting: "최재림, 이해원, 송원근, 에블린",
    },
  ];

  // 공연 시작 30분 전 예매 마감
  const isSessionPassed = (dateString, timeString) => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const todayString = `${year}-${month}-${day}`;

    if (dateString !== todayString) {
      return false;
    }

    const [hours, minutes] = timeString.split(":").map(Number);

    const sessionTime = new Date();
    sessionTime.setHours(hours, minutes, 0, 0);

    const deadlineTime = new Date(sessionTime.getTime() - 30 * 60 * 1000);

    return now >= deadlineTime;
  };

  // 날짜 선택
  const handleDateSelect = (dateString) => {
    setSelectedDate(dateString);
    setSelectedSessionId(null);
  };

  // 회차 선택
  const handleSessionClick = (sessionId) => {
    setSelectedSessionId(sessionId);
  };

  // 뒤로 가기
  const handleClose = () => {
    navigate(-1);
  };

  // 예매하기 버튼
  const handleNextStep = async () => {
    if (!selectedDate || !selectedSessionId || isSaving) {
      return;
    }

    // 선택한 회차 찾기
    const selectedSession = sessionList.find(
      (session) => session.id === selectedSessionId,
    );

    if (!selectedSession) {
      alert("선택한 회차를 찾을 수 없습니다.");
      return;
    }

    // 백엔드로 보낼 데이터
    const scheduleData = {
      concertDate: selectedDate,
      concertTime: selectedSession.time + ":00",
      vipSeats: selectedSession.seats.VIP,
      rSeats: selectedSession.seats.R,
      sSeats: selectedSession.seats.S,
      aSeats: selectedSession.seats.A,
      casting: selectedSession.casting,
    };

    try {
      setIsSaving(true);

      // 백엔드 DB에 회차 저장
      const response = await AxiosApi.createSchedule(id, scheduleData);

      // DB에서 생성된 실제 회차 ID
      const savedScheduleId = response.data.scheduleId ?? response.data.id;

      if (!savedScheduleId) {
        throw new Error("저장된 회차 ID를 확인할 수 없습니다.");
      }

      // 좌석 선택 페이지로 이동
      navigate(`/reservation/seat/${id}`, {
        state: {
          date: selectedDate,
          sessionId: savedScheduleId,
        },
      });
    } catch (error) {
      console.error("회차 저장 실패:", error.response?.data || error);

      alert("회차 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container>
      <CustomCalendar onDateSelect={handleDateSelect} />

      {selectedDate && (
        <SessionSection>
          <SectionTitle>{selectedDate} 회차 선택</SectionTitle>

          {sessionList.map((session) => {
            const isPassed = isSessionPassed(selectedDate, session.time);

            const isSelected = selectedSessionId === session.id;

            return (
              <SessionCard
                key={session.id}
                $isSelected={isSelected}
                $isPassed={isPassed}
                onClick={() => {
                  if (isPassed) {
                    alert(
                      "예매 가능 시간이 마감되었습니다. (공연 시작 30분 전 마감)",
                    );
                    return;
                  }

                  handleSessionClick(session.id);
                }}
              >
                <TimeText $isSelected={isSelected} $isPassed={isPassed}>
                  {session.time}
                  {isPassed && " (마감)"}
                </TimeText>

                <SeatInfoList>
                  <span>
                    VIP석 <strong>{session.seats.VIP}</strong>
                  </span>

                  <span>
                    R석 <strong>{session.seats.R}</strong>
                  </span>

                  <span>
                    S석 <strong>{session.seats.S}</strong>
                  </span>

                  <span>
                    A석 <strong>{session.seats.A}</strong>
                  </span>
                </SeatInfoList>

                <CastText>{session.casting}</CastText>
              </SessionCard>
            );
          })}
        </SessionSection>
      )}

      <BottomBar>
        <div>
          <Button
            enabled={Boolean(selectedDate && selectedSessionId) && !isSaving}
            onClick={handleNextStep}
          >
            {isSaving ? "저장 중..." : "예매하기"}
          </Button>
        </div>
      </BottomBar>
    </Container>
  );
};

export default ReservationSelect;
