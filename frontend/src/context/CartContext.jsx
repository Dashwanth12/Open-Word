import {createContext, useContext, useState, useEffect} from 'react'
import {useAuth} from '@clerk/clerk-react'
import BASE_URL from '../utils/api'

const CartContext = createContext()

export function CartProvider({children}){

    const [cart, setCart] = useState({items: []})
    const [loading, setLoading] = useState(false)
    const {getToken, isSignedIn} = useAuth()

    useEffect(() => {
        if (isSignedIn){
            fetchCart()
        }else{
            setCart({items: []})
        }
    }, [isSignedIn])

    async function fetchCart(){
        try{
            setLoading(true)
            const token = await getToken()
            const res = await fetch(`${BASE_URL}/api/cart`, {
                headers: {Authorization: `Bearer ${token}`}
            })
            if (res.ok){
                const data = await res.json()
                setCart(data.cart)
            }
        }catch(err){
            console.log('FetchCart error:',err)
        }finally{
            setLoading(false)
        }
    }



async function addToCart(bookId){

    try{
        setLoading(true)
        const token = await getToken()
        const res = await fetch(`${BASE_URL}/api/cart/add`, {
            method: 'POST',
            headers: {Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({bookId})
        })

        if (res.ok){
            const data = await res.json()
            setCart(data.cart)
        }else{
            const data = await res.json()
            alert(data.message)
        }
    }catch(err){
        console.log('AddToCart Error:',err)
    }finally{
        setLoading(false)
    }
}

async function updateCartItem(itemId, quantity){

    try{
        setLoading(true)
        const token = await getToken()
        const res = await fetch(`${BASE_URL}/api/cart/${itemId}`, {
            method: 'PUT',
            headers: {Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
            body: JSON.stringify({quantity})
        })
        if (res.ok){
            const data = await res.json()
            setCart(data.cart)
        }
    }catch(err){
        console.log('Update Error:',err)
    }finally{
        setLoading(false)
    }
}

async function deleteCartItem(itemId){

    try{
        setLoading(true)
        const token = await getToken()
        const res = await fetch(`${BASE_URL}/api/cart/${itemId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`}
        })
        if (res.ok){
            const data = await res.json()
            setCart(data.cart)
        }
    }catch(err){
        console.log('Deleting Item Error:',err)
    }finally{
        setLoading(false)
    }
}

async function clearCart(){

    try{
        setLoading(true)
        const token = await getToken()
        const res = await fetch(`${BASE_URL}/api/cart`, {
            method: 'DELETE',
            headers: {Authorization: `Bearer ${token}`}
        })
        if (res.ok){
            setCart({items: []})
        }
    }catch(err){
        console.log('Clear Cart error:',err)
    }finally{
        setLoading(false)
    }
}

const cartCount = cart.items?.reduce((total, item) => total + item.quantity, 0) || 0

const cartTotal = cart.items?.reduce(
    (total, item) => total + (item.book?.price || 0) * item.quantity,0
)|| 0

return (
    <CartContext.Provider value={{
        cart,
        loading,
        cartCount,
        cartTotal,
        addToCart,
        updateCartItem,
        deleteCartItem,
        clearCart
    }}>
        {children}
    </CartContext.Provider>
)
}


export function useCart(){
    return useContext(CartContext)
}
