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

    public boolean checkIfEmailExists(String email){
        return personalDetailsRepo.findByEmailId(email).isPresent();
    }

    public PersonalDetails updatePersonalDetails(PersonalDetails personalDetails, PersonalDetails updatedDetails) {
        personalDetails.setFirstName(updatedDetails.getFirstName());
        personalDetails.setLastName(updatedDetails.getLastName());
        personalDetails.setEmailId(updatedDetails.getEmailId());
        personalDetails.setPhoneNumber(updatedDetails.getPhoneNumber());
        personalDetails.setAddress(updatedDetails.getAddress());
        personalDetails.setCity(updatedDetails.getCity());
        personalDetails.setPincode(updatedDetails.getPincode());
        personalDetails.setState(updatedDetails.getState());
        personalDetails.setDateOfBirth(updatedDetails.getDateOfBirth());

        // Save the updated personal details
        return personalDetailsRepo.save(personalDetails);
    }
}
