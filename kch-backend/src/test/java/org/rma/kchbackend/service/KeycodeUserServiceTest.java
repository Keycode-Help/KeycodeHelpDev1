package org.rma.kchbackend.service;

import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Role;
import org.rma.kchbackend.repository.KeycodeUserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class KeycodeUserServiceTest {

    @Mock
    private KeycodeUserRepository keycodeUserRepository;

    @InjectMocks
    private KeycodeUserService keycodeUserService;

    private KeycodeUser keycodeUser;

    private List<KeycodeUser> keycodeUsers;
    @BeforeEach
    public void setUp(){

        keycodeUser = new KeycodeUser();
        keycodeUser.setId(11L);
        keycodeUser.setFname("Medh");
        keycodeUser.setLname("Siru");
        keycodeUser.setPhone("545452627265");
        keycodeUser.setState("Georgia");
        keycodeUser.setFrontId("FrontId".getBytes());
        keycodeUser.setBackId("BackId".getBytes());
        keycodeUser.setInsurance("Insurance".getBytes());
        keycodeUser.setEmail("medhsir@gmail.com");
        keycodeUser.setPassword("testpassword123");
    }

    @Test
    @Order(1)
    public void testSaveUser(){
        //Mock the repository's save method, so that when it is called,
        //the keycodeUser object created in setUp will be returned
        //precondition
        when(keycodeUserRepository.save(keycodeUser)).thenReturn(keycodeUser);

        //call the service method
        KeycodeUser savedUser = keycodeUserService.saveUser(keycodeUser);

        System.out.println("Saved User : "+savedUser);

        //Verify that saveUser method is called atleast once
        //Note : if we give 3, it will not pass coz method will be invoked only once
        verify(keycodeUserRepository, times(1)).save(keycodeUser);

        //Check whether the results are equal
        System.out.println("Key code user id"+keycodeUser.getId());
        System.out.println("Saved user id"+savedUser.getId());
        assertEquals(keycodeUser.getId(), savedUser.getId());
        assertEquals(keycodeUser.getEmail(), savedUser.getEmail());
        System.out.println("User information stored successfully!");

    }

    @Test
    @DisplayName("findById - User ID exists")
    @Order(2)
    public void testFindUserById_UserExists(){

        //Arrange - Mock the repository method - findById() - to return the optional of keycode user object
        when(keycodeUserRepository.findById(11L)).thenReturn(Optional.of(keycodeUser));

        //Act - Call the service method - findById
        Optional<KeycodeUser> optionalResult = keycodeUserService.findById(11L);
        System.out.println("Optional Result : "+optionalResult);
        //Assert - check whether the result exists
        assertTrue(optionalResult.isPresent());

        //Assert - check whether names are equal
        assertEquals(optionalResult.get().getFname(), keycodeUser.getFname());

        //Check whether optional result id is 11
        //Assertions.assertEquals(11, optionalResult.get().getId(), "User With ID 11 exists");
        assertEquals(11, optionalResult.get().getId());
        System.out.println("User Exists");
        // assertEquals(13, optionalResult.get().getId());   //Test Fails

    }

    @Test
    @Order(3)
    @DisplayName("findById - User does not Exist")
    public void testFindUserById_UserDoesNotExist(){
        //Mock the repository method to return empty object
        when(keycodeUserRepository.findById(12L)).thenReturn(Optional.empty());

        //Call the service method
        //Optional<KeycodeUser> optionalResult = keycodeUserService.findById(11L);  //will fail because in when we have given findById(12L)
        Optional<KeycodeUser> optionalResult = keycodeUserService.findById(12L);
        //If user does not exist, optional.isPresent should be false
        assertFalse(optionalResult.isPresent(), "User Does not exist");
        System.out.println("User does not exist!");
    }

    @Test
    @Order(4)
    @DisplayName("findByEmail - User Exists")
    public void testFindUserByEmail_UserExists()
    {
        //Mock the repository method
        when(keycodeUserRepository.findByEmail("medh.sir@gmail.com")).thenReturn(keycodeUser);

        //Call the service method
        Optional<KeycodeUser> resultKeycodeUser = keycodeUserService.findByEmail("medh.sir@gmail.com");
        //Optional<KeycodeUser> resultKeycodeUser = keycodeUserService.findByEmail("medh.sir@hello.com");   //Test fails
        //Check whether user exists - resultKeycodeUser should have value
        assertTrue(resultKeycodeUser.isPresent(), "User Exists");
        System.out.println("User with email-medh.sir@gmail.com exists ");
        //check whether ids are same
        assertEquals(keycodeUser.getId(), resultKeycodeUser.get().getId());
    }

    @Test
    @Order(5)
    @DisplayName("findByEmail - User Does Not Exist")
    public void testFindUserByEmail_UserDoesNotExists(){
        //Mock the repository method
        when(keycodeUserRepository.findByEmail("medh.sir@gmail.com")).thenReturn(null);

        //Call the service method
        Optional<KeycodeUser> resultKeycodeUser = keycodeUserService.findByEmail("medh.sir@gmail.com");

        //Check whether the result is empty
        assertTrue(resultKeycodeUser.isEmpty());
        System.out.println("User with email-medh.sir@gmail.com does not exists");
        //assertTrue(resultKeycodeUser.isPresent());    //Fails because we are returning null in mock
    }

    @Test
    @Order(6)
    @DisplayName("getAllUsers")
    public void testGetAllUsers(){
        keycodeUsers = new ArrayList<KeycodeUser>();
        keycodeUsers.add(keycodeUser);
        System.out.println(keycodeUsers);
        KeycodeUser keycodeUser2 = new KeycodeUser();
        keycodeUser2.setId(12L);
        keycodeUser2.setFname("Medhini");
        keycodeUser2.setLname("Siru");
        keycodeUser2.setPhone("545452627265");
        keycodeUser2.setState("Florida");
        keycodeUser2.setFrontId("FrontId".getBytes());
        keycodeUser2.setBackId("BackId".getBytes());
        keycodeUser2.setInsurance("Insurance".getBytes());
        keycodeUser2.setEmail("medhinisir@gmail.com");
        keycodeUser2.setPassword("testpassword123");
        keycodeUsers.add(keycodeUser);
        System.out.println(keycodeUsers);

        //precondition
        when(keycodeUserRepository.findByRole(Role.BASEUSER)).thenReturn(List.of(keycodeUser, keycodeUser2));

        //Call the service method
        List<KeycodeUser> resultKeycodeUserList = keycodeUserService.getAllUsers();

        //verify
        System.out.println("All Users : "+resultKeycodeUserList);
        assertThat(resultKeycodeUserList).isNotNull();
        System.out.println("List is not Null");
        assertThat(resultKeycodeUserList.size()).isGreaterThan(1);
        System.out.println("List size is greater than 1");
    }

}
