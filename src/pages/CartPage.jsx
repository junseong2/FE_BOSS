"use client"

import { Trash2, ShoppingCart, Home, CreditCard, Minus, Plus, RefreshCw } from "lucide-react"
import {  cva } from "class-variance-authority";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Define the cn utility function
function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

// Define the Button component
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

import PropTypes from "prop-types";

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
})
Button.displayName = "Button"

// Define the Input component
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

// Define the Card components
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef(({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
))
CardFooter.displayName = "CardFooter"

// Define Separator component
const Separator = React.forwardRef(({ className, orientation = "horizontal", ...props }, ref) => (
  <div
    ref={ref}
    className={cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className)}
    {...props}
  />
))
Separator.displayName = "Separator"




export default function CartPage() {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:5000/auth/user-info", {
        method: "GET",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("로그인 정보 조회 실패")
      }

      const data = await response.json()
      setUserId(data.userId)
      setUserName(data.userName)
      await loadCart()
    } catch (error) {
      console.error("사용자 정보 조회 오류:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadCart = async () => {
    try {
      const response = await fetch("http://localhost:5000/cart", {
        method: "GET",
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("장바구니 조회 실패");
      }
  
      const data = await response.json();
      setCartItems(data.cartItems ?? []);  // null일 경우 빈 배열로 설정
    } catch (error) {
      console.error("장바구니 조회 오류:", error);
    }
  };
  
  const clearCart = async () => {
    try {
      const response = await fetch("http://localhost:5000/cart/clear", {
        method: "POST",
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("장바구니 비우기 실패");
      }
  
      console.log("Cart cleared successfully");
  
      // ✅ 장바구니 상태를 빈 배열로 설정
      setCartItems([]);
    } catch (error) {
      console.error("장바구니 비우기 오류:", error);
    }
  };
  

  const removeItemFromCart = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/cart/remove?productId=${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }
  
      console.log("Item removed successfully");
  
      // ✅ 삭제된 상품을 상태에서 즉시 제거
      setCartItems((prevCart) => prevCart.filter((item) => item.productId !== productId));
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };
  
  


  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      alert("수량은 1개 이상이어야 합니다.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/cart/updatequantity`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }
  
      console.log("Quantity updated successfully");
  
      // ✅ 변경된 수량을 상태에 반영
      setCartItems((prevCart) =>
        prevCart.map((item) =>
          item.productId === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };
  
  

  /*

    try {
      const response = await fetch("http://localhost:5000/cart/updatequantity", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId: productId,
          quantity: newQuantity,
        }),
      })

      if (!response.ok) {
        throw new Error("수량 업데이트 실패")
      }

      await loadCart()
    } catch (error) {
      console.error("수량 업데이트 오류:", error)
    }
  
*/
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.productPrice * item.quantity, 0)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg font-medium">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader className="bg-primary/5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <ShoppingCart className="h-6 w-6" />
              장바구니
            </CardTitle>
            {userId && userName && (
              <div className="text-sm font-medium bg-primary/10 px-3 py-1 rounded-full">{userName} 님의 장바구니</div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {!userId && (
            <div className="bg-amber-50 text-amber-800 p-4 rounded-md mb-6 flex items-center gap-2">
              <p>로그인이 필요합니다.</p>
            </div>
          )}

          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">장바구니가 비어 있습니다.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.cartId}
                  className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{item.productName}</h3>
                    <p className="text-muted-foreground text-sm">상품 ID: {item.productId}</p>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
                    <p className="text-sm font-medium">가격</p>
                    <p className="font-semibold">{item.productPrice.toLocaleString()}원</p>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
                    <p className="text-sm font-medium">수량</p>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-r-none"
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = Number.parseInt(e.target.value) || 1
                          const updatedCart = cartItems.map((cartItem) =>
                            cartItem.productId === item.productId ? { ...cartItem, quantity: newQuantity } : cartItem,
                          )
                          setCartItems(updatedCart)
                        }}
                        onBlur={(e) => updateQuantity(item.productId, Number.parseInt(e.target.value) || 1)}
                        min="1"
                        className="h-8 w-16 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-l-none"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
                    <p className="text-sm font-medium">합계</p>
                    <p className="font-semibold">{(item.productPrice * item.quantity).toLocaleString()}원</p>
                  </div>

                  <div className="flex items-center justify-end">
                    <Button variant="destructive" size="icon" onClick={() => removeItemFromCart(item.productId)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">총 결제 금액</span>
                  <span className="text-2xl font-bold text-primary">{calculateTotal().toLocaleString()}원</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 justify-between bg-muted/20 p-6">
          <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => navigate("/")}>
          <Home className="h-4 w-4" />
              홈으로
            </Button>

            {cartItems.length > 0 && (
              <Button variant="destructive" className="flex items-center gap-2" onClick={clearCart}>
                <Trash2 className="h-4 w-4" />
                장바구니 비우기
              </Button>
            )}
          </div>

          <Button
  className="flex items-center gap-2"
  disabled={cartItems.length === 0}
  onClick={() => navigate("/paymentpage")}  // ✅ 수정된 부분
>
  <CreditCard className="h-4 w-4" />
  결제하기
</Button>

        </CardFooter>
      </Card>
    </div>
  )
}