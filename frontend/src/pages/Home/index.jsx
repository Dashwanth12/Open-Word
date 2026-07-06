import React from 'react'
import Banner from '../../components/Banner'
import BestSellers from '../BestSellers'
import WhyUs from '../../components/WhyUs'
import './index.css'

function Home(){

    return (
        <div className='home-page'>
                <Banner />
                <BestSellers />
                <WhyUs />
        </div>
    )
}
export default Home