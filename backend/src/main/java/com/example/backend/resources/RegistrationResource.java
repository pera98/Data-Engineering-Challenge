package com.example.backend.resources;

import com.example.backend.entities.Registration;
import com.example.backend.services.RegistrationService;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/registrations")
public class RegistrationResource {

    @Inject
    private RegistrationService registrationService;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Registration> allRegistrations(){
        return this.registrationService.allRegistrations();
    }

}