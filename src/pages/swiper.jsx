<Swiper>
  <SwiperSlide>
    <img
      data-src="static/banner1.jpg"
      // {`http://localhost:3001/api/v1/attachment/${_id}`}
      style={{ width: "100%", height: 180 }}
      // className="lazy"
      // data-lazy={{ enabled: true }}
    />
  </SwiperSlide>
  <SwiperSlide>2</SwiperSlide>
  <SwiperSlide>4</SwiperSlide>
  {/* {barners.map(({ _id }, index) => (
            <SwiperSlide key={index}>
              <img
                data-src="static/banner1.jpg"
                // {`http://localhost:3001/api/v1/attachment/${_id}`}
                style={{ width: "100%", height: 180 }}
                className="lazy"
                data-lazy={{ enabled: true }}
              />
            </SwiperSlide>
          ))}

          {!barners.length && (
            <SwiperSlide>
              <img
                data-src="static/banner1.jpg"
                style={{ width: "100%", height: 180 }}
                className="lazy"
              />
            </SwiperSlide>
          )} */}
</Swiper>;
