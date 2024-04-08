import './home.scss'

const Home = () => {
  return (
    <div className='home'>
      <img src="/HERO.jpg" alt="hero img" />
      <div className="overlay"></div>
      <header>
        <h2>VeriScan</h2>
      </header>

      <div className="texts">
        <p>
          Image
        </p>
        <p>
          Deepfake Detection API
        </p>
        <p className='slogan'>
          A simple App to verify the authenticity of your photos with our deepfake detection tool.
        </p>

        <button>
          Try this!
        </button>
      </div>
    </div>
  )
}
export default Home