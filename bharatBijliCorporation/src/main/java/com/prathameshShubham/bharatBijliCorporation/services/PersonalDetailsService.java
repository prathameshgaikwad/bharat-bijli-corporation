package com.prathameshShubham.bharatBijliCorporation.services;

import com.prathameshShubham.bharatBijliCorporation.models.PersonalDetails;
import com.prathameshShubham.bharatBijliCorporation.repositories.PersonalDetailsRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PersonalDetailsService {

    @Autowired
    private PersonalDetailsRepo personalDetailsRepo;

    public PersonalDetails savePersonalDetails(PersonalDetails personalDetails) {
        return personalDetailsRepo.save(personalDetails);
    }

    public PersonalDetails getPersonalDetails(Long personalDetailsId) {
        return personalDetailsRepo
                .findById(personalDetailsId)
                .orElseThrow(
                        () -> new EntityNotFoundException("Personal details not found for ID: " + personalDetailsId)
                );
    }
}
