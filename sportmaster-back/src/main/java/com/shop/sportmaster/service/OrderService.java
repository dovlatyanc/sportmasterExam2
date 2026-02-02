package com.shop.sportmaster.service;

import com.shop.sportmaster.dto.GuestOrderRequest;
import com.shop.sportmaster.model.*;
import com.shop.sportmaster.repository.*;
import com.shop.sportmaster.status.OrderStatus;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final AuthService authService;

    // ---------- АВТОРИЗОВАННЫЙ ----------
    public Order createOrder(User user) {

        List<CartItem> cartItems = cartItemRepository.findByUser(user);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Корзина пуста");
        }

        Order order = new Order();
        order.setUser(user);
        order.setCreatedAt(LocalDateTime.now());
        order.setStatus(OrderStatus.NEW);

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(cartItem.getProduct());
            item.setQuantity(cartItem.getQuantity());

            BigDecimal itemTotal = cartItem.getProduct()
                    .getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));

            total = total.add(itemTotal);
            orderItems.add(item);
        }

        order.setTotalPrice(total);
        order.setItems(orderItems);

        Order saved = orderRepository.save(order);
        cartItemRepository.deleteByUser(user);

        return saved;
    }

    // ---------- ГОСТЕВОЙ ----------
    public Order createGuestOrder(GuestOrderRequest request) {

        Profile profile = new Profile();
        profile.setFullName(request.getFullName());
        profile.setEmail(request.getEmail());
        profile.setPhone(request.getPhone());
        profile.setCity(request.getCity());
        profile.setCountry(request.getCountry());

        User guest = authService.createGuestUser(profile);

        Order order = new Order();
        order.setUser(guest);
        order.setCreatedAt(LocalDateTime.now());
        order.setStatus(OrderStatus.NEW);

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();

        for (GuestOrderItem dto : request.getCartItems()) {

            Product product = productRepository.findById(dto.productId)
                    .orElseThrow(() -> new RuntimeException("Товар не найден"));

            if (product.getStock() < dto.quantity) {
                throw new RuntimeException("Недостаточно товара");
            }

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(dto.quantity);

            BigDecimal itemTotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(dto.quantity));

            total = total.add(itemTotal);
            items.add(item);

            product.setStock(product.getStock() - dto.quantity);
        }

        order.setItems(items);
        order.setTotalPrice(total);

        return orderRepository.save(order);
    }

    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUser(user);
    }
}
