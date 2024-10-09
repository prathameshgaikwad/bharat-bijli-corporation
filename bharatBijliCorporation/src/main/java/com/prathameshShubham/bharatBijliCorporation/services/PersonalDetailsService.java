package com.prathameshShubham.bharatBijliCorporation.services;

import com.prathameshShubham.bharatBijliCorporation.exceptions.DetailsNotUpdatedExceptions;
import com.prathameshShubham.bharatBijliCorporation.models.PersonalDetails;
import com.prathameshShubham.bharatBijliCorporation.repositories.PersonalDetailsRepo;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PersonalDetailsService {

    @Autowired
    private PersonalDetailsRepo personalDetailsRepo;

    @Autowired
    private MailService mailService;

    public PersonalDetails savePersonalDetails(PersonalDetails personalDetails) {
        return personalDetailsRepo.save(personalDetails);
    }

    public boolean checkIfEmailExists(String email){
        return personalDetailsRepo.findByEmailId(email).isPresent();
    }

    public PersonalDetails updatePersonalDetails(PersonalDetails personalDetails, PersonalDetails updatedDetails) {

        if (areDetailsSame(personalDetails, updatedDetails)) {
            throw new DetailsNotUpdatedExceptions("Details not updated");
        }

        personalDetails.setFirstName(updatedDetails.getFirstName());
        personalDetails.setLastName(updatedDetails.getLastName());
        personalDetails.setEmailId(updatedDetails.getEmailId());
        personalDetails.setPhoneNumber(updatedDetails.getPhoneNumber());
        personalDetails.setAddress(updatedDetails.getAddress());
        personalDetails.setCity(updatedDetails.getCity());
        personalDetails.setPincode(updatedDetails.getPincode());
        personalDetails.setState(updatedDetails.getState());
        personalDetails.setDateOfBirth(updatedDetails.getDateOfBirth());

//        try {
//            mailService.updationEmail(updatedDetails);
//        } catch (MessagingException e) {
//            throw new RuntimeException(e);
//        }

        // Save the updated personal details
        return personalDetailsRepo.save(personalDetails);
    }

    private boolean areDetailsSame(PersonalDetails existing, PersonalDetails updated) {
        return existing.getFirstName().equals(updated.getFirstName()) &&
                existing.getLastName().equals(updated.getLastName()) &&
                existing.getEmailId().equals(updated.getEmailId()) &&
                existing.getPhoneNumber().equals(updated.getPhoneNumber()) &&
                existing.getAddress().equals(updated.getAddress()) &&
                existing.getCity().equals(updated.getCity()) &&
                existing.getPincode().equals(updated.getPincode()) &&
                existing.getState().equals(updated.getState()) &&
                existing.getDateOfBirth().equals(updated.getDateOfBirth());
    }
}
