package org.rma.kchbackend.service;


import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.junit.jupiter.MockitoExtension;
import org.rma.kchbackend.model.*;
import org.rma.kchbackend.repository.*;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class CartServiceTest {

    @Mock
    protected CartRepository cartRepository;

    @Mock
    protected CartItemRepository cartItemRepository;

    @Mock
    SubscriptionRepository subscriptionRepository;

    @Mock
    protected SubscriptionService subscriptionService;

    @Mock
    protected VehicleRepository vehicleRepository;

    @Mock
    protected TransactionRepository transactionRepository;


    @InjectMocks
    protected CartService cartService;

    protected KeycodeUser keycodeUser;
    protected Cart existingCart;


    @BeforeEach
    public void setUp() {
//        byte [] fIdPath;
//        try {
//            fIdPath = getClass().getClassLoader().getResourceAsStream("src/test/java/resources/john_driver_b_id.jpg").readAllBytes();
//        } catch (IOException e) {
//            throw new RuntimeException(e);
//        }
//        byte[] bIdPath;
//        try {
//            bIdPath = getClass().getClassLoader().getResourceAsStream("src/test/java/resources/john_driver_b_id.jpg").readAllBytes();
//        } catch (IOException e) {
//            throw new RuntimeException(e);
//        }
//
//        byte[] insurancePath;
//        try {
//            insurancePath = getClass().getClassLoader().getResourceAsStream("src/test/java/resources/insurance_card.jpg").readAllBytes();
//        } catch (IOException e) {
//            throw new RuntimeException(e);
//        }
        keycodeUser = new KeycodeUser();
        keycodeUser.setId(1L);
        keycodeUser.setFname("John");
        keycodeUser.setLname("Doe");
        keycodeUser.setEmail("jdoe@gmail.com");
        keycodeUser.setPhone("1234567890");
        keycodeUser.setPassword("password");
        keycodeUser.setRole(Role.BASEUSER);
        keycodeUser.setVehicles(new ArrayList<>());
        keycodeUser.setSubscription(null);
//        keycodeUser.setFrontId(fIdPath);
//        keycodeUser.setBackId(bIdPath);
//        keycodeUser.setInsurance(insurancePath);
        existingCart = new Cart();
        existingCart.setKeycodeUser(keycodeUser);
        existingCart.setCartItems(new ArrayList<>());

    }

    @Nested
    class CreateCartTest{

        Cart newCart;

        @Test
        void shouldCreateNewCart() {
            //Arrange
            when(cartRepository.findByKeycodeUser(keycodeUser)).thenReturn(Optional.empty());
            when(cartRepository.save(any(Cart.class))).thenAnswer(invocation -> invocation.getArgument(0));

            newCart = cartService.getOrCreateCart(keycodeUser);

            //Assert
            assertThat(newCart)
                    .isNotNull()
                    .extracting(Cart::getKeycodeUser)
                    .isEqualTo(keycodeUser);
            verify(cartRepository).findByKeycodeUser(keycodeUser);
            verify(cartRepository).save(any(Cart.class));
        }

        @Test
        void shouldReturnExistingCart() {
            //Arrange
            when(cartRepository.findByKeycodeUser(keycodeUser)).thenReturn(Optional.of(existingCart));
            newCart = cartService.getOrCreateCart(keycodeUser);

            //Assert
            assertThat(newCart)
                    .as("Cart should not be null")
                    .isNotNull();

            assertThat(newCart.getKeycodeUser())
                    .as("Cart should be associated with a user")
                    .isEqualTo(keycodeUser);
        }
    }


    @Nested
    class AddVehicleTest{
        Vehicle vehicle;
        Vehicle vehicle2;
        CartItem cartItem;
        CartItem cartItem2;

        @BeforeEach
        void setUpVehicle(){
            vehicle = new Vehicle();
            vehicle.setKeycodeUser(keycodeUser);
            vehicle.setId(1L);
            vehicle.setMake("Ford");
            vehicle.setModel("Mustang");
            vehicle.setVin("AD32C245T");
            cartItem = new CartItem();
            cartItem.setId(1L);
        }

        @Test
        public void shouldAddVehicle() {
            //Arrange
            vehicle2 = new Vehicle();
            vehicle2.setKeycodeUser(keycodeUser);
            vehicle2.setMake("Cadillac");
            vehicle2.setModel("Coupe de Ville");
            vehicle2.setVin("FC342MG3A");
            cartItem2 = new CartItem();
            cartItem2.setId(2L);

            when(cartRepository.findByKeycodeUser(keycodeUser)).thenReturn(Optional.of(existingCart));
            when(cartRepository.save(any(Cart.class))).thenAnswer(invocation -> invocation.getArgument(0));
            when(cartItemRepository.save(any(CartItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

            cartItem.setVehicle(vehicle);
            cartItem.setCart(existingCart);

            cartItem2.setVehicle(vehicle2);
            cartItem2.setCart(existingCart);

            //Act
            existingCart = cartService.addVehicleToCart(keycodeUser, vehicle);
            existingCart = cartService.addVehicleToCart(keycodeUser, vehicle2);

            //Assert
            assertThat(existingCart.getCartItems())
                    .as("Cart should have two vehicles")
                    .hasSize(2)
                    .extracting("vehicle")
                    .containsExactly(vehicle, vehicle2);

            verify(cartRepository, times(2)).findByKeycodeUser(keycodeUser);
            verify(cartItemRepository, times(2)).save(any(CartItem.class));
            verify(cartRepository, times(2)).save(any(Cart.class));

        }

        @Test
        public void shouldThrowExceptionWhenSameVehicleExists() {
            //Arrange

            CartItem existingCartItem = new CartItem(vehicle);
            existingCartItem.setCart(existingCart);
            existingCartItem.setVehicle(vehicle);
            existingCart.addCartItem(existingCartItem);

            //Mock
            when(cartService.getOrCreateCart(keycodeUser)).thenReturn(existingCart);

            //Act
            Throwable thrown = catchThrowable(() -> {
                cartService.addVehicleToCart(keycodeUser, vehicle);
            });


            //Assert
            assertThat(thrown)
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("Vehicle is already in the cart.");

            assertThat(existingCart.getCartItems())
                    .hasSize(1);
            verify(cartItemRepository, never()).save(any(CartItem.class));

        }
    }


    @Test
    public void shouldAddSubscriptionToCart() {
        //Arrange
        Role role = Role.BASEUSER;
        Subscription subscription = new Subscription();
        SubscriptionTier tier = SubscriptionTier.BASE;
        subscription.setId(1L);
        subscription.setTier(tier);
        keycodeUser.setId(1L);

        //Mock
        when(cartRepository.findByKeycodeUser(keycodeUser)).thenReturn(Optional.of(existingCart));
        doNothing().when(subscriptionService).validateUserSubscription(keycodeUser);

        //Act
        cartService.addSubscriptionToCart(keycodeUser, subscription);

        //Assert
        verify(subscriptionService).validateUserSubscription(keycodeUser);
        verify(subscriptionService).saveSubscription(subscription);
        verify(cartRepository).save(existingCart);

        assertThat(existingCart.getCartItems())
                .hasSize(1)
                    .first()
                    .satisfies(cartItem -> {
                        // Basic null check first
                        cartItem.setSubscription(subscription);
                        assertThat(cartItem).as("Cart item should not be null").isNotNull();

                        // Then check subscription
                        assertThat(cartItem.getSubscription())
                                .as("Cart item should be a subscription")
                                .isNotNull()
                                .isEqualTo(subscription);
                    });
    }

    @Test
    public void shouldThrowExceptionWhenASubscriptionExists() {
        //Arrange
        Role role = Role.BASEUSER;
        Subscription subscription = new Subscription();
        SubscriptionTier tier = SubscriptionTier.BASE;
        subscription.setId(1L);
        subscription.setTier(tier);
        keycodeUser.setId(1L);

        existingCart.setKeycodeUser(keycodeUser);
        CartItem existingItem = new CartItem(subscription);
        existingItem.setCart(existingCart);
        existingItem.setSubscription(subscription);
        existingCart.addCartItem(existingItem);

        //Mock
        when(cartRepository.findByKeycodeUser(keycodeUser)).thenReturn(Optional.of(existingCart));
        doThrow(new IllegalStateException("User already has an active subscription"))
                .when(subscriptionService).validateUserSubscription(keycodeUser);

        //Act
        assertThatThrownBy(() -> cartService.addSubscriptionToCart(keycodeUser, subscription))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("User already has an active subscription");


        //Assert
        verify(subscriptionService).validateUserSubscription(keycodeUser);
        verify(subscriptionService, never()).saveSubscription(any());

        assertThat(existingCart.getCartItems()).hasSize(1);

    }

    @Test
    void shouldReturnAllCartItems() {
        Subscription subscription = new Subscription();
        subscription.setId(1L);
        subscription.setTier(SubscriptionTier.PREMIUM);
        subscription.setKeycodeUser(keycodeUser);

        Vehicle vehicle = new Vehicle();
        vehicle.setId(1L);
        Vehicle vehicle2 = new Vehicle();
        vehicle2.setId(2L);
        Vehicle vehicle3 = new Vehicle();
        vehicle3.setId(3L);


        existingCart.setKeycodeUser(keycodeUser);
        CartItem cartItem1 = new CartItem(subscription);
        CartItem cartItem2 = new CartItem(vehicle);
        CartItem cartItem3 = new CartItem(vehicle2);
        CartItem cartItem4 = new CartItem(vehicle3);

        existingCart.addCartItem(cartItem1);
        existingCart.addCartItem(cartItem2);
        existingCart.addCartItem(cartItem3);
        existingCart.addCartItem(cartItem4);

        //Act
        List<CartItem> cartList = existingCart.getCartItems();

        //Assert
        assertThat(cartList)
                .isNotNull()
                .hasSize(4)
                .containsExactlyInAnyOrder(cartItem1, cartItem2, cartItem3, cartItem4)
                .doesNotContainNull();

    }


    @Test
    void shouldRemoveVehicleFromCartWhenNoTransaction(){
        //Arrange
        Vehicle vehicle = new Vehicle();
        vehicle.setId(1L);
        vehicle.setMake("Dodge");
        vehicle.setModel("Neon");
        vehicle.setStatus("PENDING");
        vehicle.setVin("123456MAD");
        keycodeUser.setVehicles(new ArrayList<>());

        CartItem cartItem = new CartItem();
        cartItem.setId(2L);
        cartItem.setVehicle(vehicle);
        vehicle.setCartItem(cartItem);

        //Mock
        when(cartItemRepository.findById(cartItem.getId())).thenReturn(Optional.of(cartItem));

        //Act
        cartService.removeCartItem(cartItem.getId());

        assertThat(cartItem.getVehicle()).isNull();
        assertThat(vehicle.getKeycodeUser()).isNull();
        assertThat(vehicle.getCartItem()).isNull();
        assertThat(keycodeUser.getVehicles()).doesNotContain(vehicle);
        assertThat(existingCart.getCartItems()).doesNotContain(cartItem);
        verify(vehicleRepository).delete(vehicle);
        verify(cartItemRepository).delete(cartItem);

    }

    @Test
    void shouldRemoveFromCartWhenHasTransaction(){
        //Arrange
        Vehicle vehicle = new Vehicle();
        vehicle.setId(1L);
        vehicle.setMake("Dodge");
        vehicle.setModel("Neon");
        vehicle.setStatus("PENDING");
        vehicle.setVin("123456MAD");

        CartItem cartItem = new CartItem();
        cartItem.setId(2L);
        cartItem.setVehicle(vehicle);
        vehicle.setCartItem(cartItem);

        vehicle.setTransaction(new Transaction());
        when(cartItemRepository.findById(cartItem.getId())).thenReturn(Optional.of(cartItem));

        //Act
        cartService.removeCartItem(cartItem.getId());

        //Assert
        verify(vehicleRepository, never()).delete(vehicle);
        assertThat(cartItem.getVehicle()).isNull();
        assertThat(vehicle.getKeycodeUser()).isNull();
        assertThat(vehicle.getCartItem()).isNull();
        assertThat(existingCart.getCartItems()).doesNotContain(cartItem);
    }

    @Test
    void shouldThrowErrorWhenCartItemDoesNotExist() {
        CartItem cartItem = new CartItem();
        cartItem.setId(1L);

        //Mock
        when(cartItemRepository.findById(cartItem.getId())).thenReturn(Optional.empty());

        //Act & Assert
        assertThatThrownBy(() -> cartService.removeCartItem(cartItem.getId()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("CartItem not found");
    }

    @Test
    void shouldRemoveSubscriptionFromCart(){
        //Arrange
        Subscription subscription = new Subscription();
        subscription.setId(1L);
        subscription.setTier(SubscriptionTier.BASE);
        subscription.setKeycodeUser(keycodeUser);
        keycodeUser.setSubscription(subscription);

        CartItem cartItem = new CartItem();
        cartItem.setSubscription(subscription);
        subscription.setCartItem(cartItem);
        cartItem.setId(2L);

        //Mock
        when(cartItemRepository.findById(cartItem.getId())).thenReturn(Optional.of(cartItem));

        //Act
        cartService.removeCartItem(cartItem.getId());

        //Assert
        verify(subscriptionRepository).delete(subscription);
        verify(cartItemRepository).delete(cartItem);
        assertThat(cartItem.getSubscription()).isNull();
        assertThat(subscription.getKeycodeUser()).isNull();
        assertThat(subscription.getCartItem()).isNull();
        assertThat(keycodeUser.getSubscription()).isNull();
        assertThat(existingCart.getCartItems()).doesNotContain(cartItem);

    }

    @Test
    void shouldCheckoutUserWithSubscription() throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {
        Subscription subscription = new Subscription();
        subscription.setId(1L);
        subscription.setTier(SubscriptionTier.BASE);
        subscription.setKeycodeUser(keycodeUser);
        keycodeUser.setSubscription(subscription);

        Class<?> clazz = cartService.getClass();
        Method method = clazz.getDeclaredMethod("generateConfirmationNumber");
        method.setAccessible(true);
        String confirmationNumber = (String) method.invoke(cartService);

        Transaction transaction = new Transaction();
        transaction.setId(1L);
        transaction.setKeycodeUser(existingCart.getKeycodeUser());
        transaction.setConfirmationNumber(confirmationNumber);

        CartItem cartItem = new CartItem();
        cartItem.setSubscription(subscription);
        subscription.setCartItem(cartItem);
        cartItem.setId(2L);


        when(cartItemRepository.findById(cartItem.getId())).thenReturn(Optional.of(cartItem));

    }
//    @Test
//    void checkoutCart() {
//    }
}