package com.prathameshShubham.bharatBijliCorporation.repositories;

import com.prathameshShubham.bharatBijliCorporation.models.PersonalDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonalDetailsRepo extends JpaRepository<PersonalDetails, Long> {
}
