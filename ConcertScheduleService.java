package com.human.mini_prj.service;

import com.human.mini_prj.dto.ScheduleReqDto;
import com.human.mini_prj.dto.ScheduleResDto;
import com.human.mini_prj.entity.ConcertSchedule;
import com.human.mini_prj.repository.ConcertScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConcertScheduleService {

    private final ConcertScheduleRepository concertScheduleRepository;

    // 공연 회차 조회
    public List<ScheduleResDto> getSchedule(Long concertId) {
        return concertScheduleRepository
                .findByConcertIdOrderByConcertDateAscConcertTimeAsc(concertId)
                .stream()
                .map(ScheduleResDto::new)
                .toList();
    }

    // 공연 회차 등록
    public ScheduleResDto createSchedule(Long concertId, ScheduleReqDto dto) {

        ConcertSchedule schedule = new ConcertSchedule();

        schedule.setConcertId(concertId);
        schedule.setConcertDate(dto.getConcertDate());
        schedule.setConcertTime(dto.getConcertTime());

        ConcertSchedule saved =
                concertScheduleRepository.save(schedule);

        return new ScheduleResDto(saved);
    }
}
