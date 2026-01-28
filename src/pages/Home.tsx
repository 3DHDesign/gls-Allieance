 
import Hero from '../components/Home/Hero' 
// import PopularCategories from '../components/Home/PopularCategories'

import HowItWorks from '../components/Home/HowItWorks'
//import NewsEvents from '../components/Home/NewsEvents'
import TestimonialSlider from '../components/Home/TestimonialSlider'
//import LogisticsBanner from '../components/Home/LogisticsBanner'
import DirectoryActions from '../components/Home/DirectoryActions'
// import CountryFlags from '../components/Home/CountryFlags'

const Home = () => {
  return (
    <div>
        <Hero/>
        <DirectoryActions/>
        {/* <PopularCategories/> */}
        {/* <PopularListingsSlider/> */}
        <TestimonialSlider/>
        {/* <LogisticsBanner/> */}
        <HowItWorks/>
        {/* <CountryFlags/> */}
        
        {/* <NewsEvents/> */}

    </div>
  )
}

export default Home