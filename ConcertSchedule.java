package com.human.mini_prj.entity;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name= "concert_Schedule") 
@Getter @Setter

public class ConcertSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;        // 공연 회차 고유 번호

    private Long concertId;    // 어떤 공연인지 나타내는 번호

    private LocalDate concertDate;        // 공연날짜

    private LocalTime concertTime;        // 공연 시작시간 
}
