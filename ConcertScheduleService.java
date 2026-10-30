package com.human.mini_prj.service;

// React에 전달할 데이터 형식
import com.human.mini_prj.dto.ScheduleResDto;

// DB에서 공연 회차를 조회하는 Repository
import com.human.mini_prj.repository.ScheduleRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service


@RequiredArgsConstructor
public class ConcertScheduleService {

    // DB 조회를 담당하는 Repository 주입
    private final ScheduleRepository scheduleRepository;

    // concertId를 전달받아 해당 공연의 회차 목록을 조회
    public List<ScheduleResDto> getSchedule(Long concertId) {

        return scheduleRepository

                // 해당 공연의 회차를 날짜와 시간 순서대로 조회
                .findByConcertIdOrderByConcertDateAscConcertTimeAsc(concertId)

                // 조회된 Entity를 React에 전달할 DTO로 변환
                .stream()
                .map(ScheduleResDto::new)

                // 변환된 DTO들을 List로 반환
                .toList();
    }
}
