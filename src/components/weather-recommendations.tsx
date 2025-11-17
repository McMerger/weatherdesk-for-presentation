import type { CurrentWeather } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Umbrella, Sun, Snowflake, Wind, Droplets } from "lucide-react";

type WeatherRecommendationsProps = {
  weather: CurrentWeather;
};

type Recommendation = {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
};

// Helper function to randomly select from an array based on weather data (deterministic)
function selectVariation<T>(options: T[], seed: number): T {
  const index = Math.abs(seed) % options.length;
  return options[index];
}

function getWeatherRecommendations(weather: CurrentWeather): Recommendation[] {
  const { condition, temperature, humidity, windSpeed } = weather;
  const recommendations: Recommendation[] = [];
  const conditionLower = condition.toLowerCase();

  // Create a deterministic seed from weather data for consistent but varied recommendations
  const seed = Math.floor(temperature * 100 + humidity + windSpeed);

  // PRIORITY 1: SAFETY-CRITICAL CONDITIONS (always show first)
  if (conditionLower.includes("thunderstorm") || conditionLower.includes("thunder")) {
    const thunderstormDescriptions = [
      "Dangerous electrical storm approaching! Seek indoor shelter immediately, stay away from windows and doors, unplug sensitive electronics. Wait at least 30 minutes after the last thunder before going outside.",
      "Active thunderstorm in your area. Get inside now and avoid using corded phones or touching plumbing. If caught outside, crouch low in an open area away from trees and metal objects.",
      "Severe weather alert! Lightning strikes within miles. Take shelter in a substantial building or hard-topped vehicle. Avoid open fields, hilltops, and isolated trees at all costs."
    ];

    recommendations.push({
      icon: <Wind className="w-5 h-5" />,
      title: "⚠️ Thunderstorm Warning",
      description: selectVariation(thunderstormDescriptions, seed),
      color: "text-red-600",
    });
  }

  if (conditionLower.includes("fog") || conditionLower.includes("mist")) {
    const fogDescriptions = [
      "Limited visibility ahead. If driving, use low beams (not high beams!), reduce speed by at least 50%, and increase following distance to 5+ seconds. Consider delaying travel until conditions improve.",
      "Thick fog rolling in. Drive with extreme caution using fog lights if available, listen for traffic you can't see, and pull completely off the road if visibility drops below 100 feet.",
      "Heavy fog conditions reducing visibility. Use road edge lines as guides, avoid passing other vehicles, and turn on hazard lights if moving significantly below the speed limit."
    ];

    recommendations.push({
      icon: <Wind className="w-5 h-5" />,
      title: "⚠️ Reduced Visibility",
      description: selectVariation(fogDescriptions, seed),
      color: "text-gray-600",
    });
  }

  // PRIORITY 2: COMPREHENSIVE TEMPERATURE COVERAGE (November-appropriate)
  if (temperature < 0) {
    const freezingDescriptions = [
      "Bitter cold! Black ice likely on roads and walkways - walk like a penguin (short steps, flat feet) to avoid slipping. Layer up with thermal base, insulating mid-layer, and windproof outer shell. Cover all exposed skin to prevent frostbite.",
      "Sub-zero temperatures mean serious winter gear time. Dress in layers: merino wool base, fleece or down mid-layer, weatherproof jacket. Don't forget insulated gloves, warm hat covering ears, and thick socks. Check on elderly neighbors.",
      "Freezing conditions outside! Protect your pipes by letting faucets drip slightly. If venturing out, wear multiple thin layers rather than one thick coat for better insulation. Limit outdoor exposure to 30-minute intervals."
    ];

    recommendations.push({
      icon: <Snowflake className="w-5 h-5" />,
      title: "Freezing Conditions",
      description: selectVariation(freezingDescriptions, seed),
      color: "text-blue-600",
    });
  } else if (temperature >= 0 && temperature < 4) {
    const veryColdDescriptions = [
      "Just above freezing - that deceptive cold that sneaks through your jacket. Perfect weather for ice skating if there's a rink nearby, or for cozying up with hot chocolate and a good book. Bundle up with a puffy coat and insulated boots.",
      "Near-zero temps! Great excuse to try that new soup recipe or visit an indoor market. If heading outside, wear windproof layers and keep moving - standing still in this weather is no fun. Heated car seats were invented for days like this.",
      "Chilly enough to see your breath! Ideal conditions for winter photography (frost crystals look amazing) or testing out your new winter running gear. Pro tip: wear a neck gaiter and moisture-wicking base layers to stay comfortable."
    ];

    recommendations.push({
      icon: <Snowflake className="w-5 h-5" />,
      title: "Very Cold",
      description: selectVariation(veryColdDescriptions, seed),
      color: "text-blue-500",
    });
  } else if (temperature >= 4 && temperature < 10) {
    const coolDescriptions = [
      "Classic autumn chill in the air. Perfect for apple picking, corn mazes, or hiking through crunchy fallen leaves. Pack a thermos of something warm and wear layers you can peel off if you heat up from activity. Scarves are your friend today!",
      "Cool and crisp - the kind of weather that makes you feel alive! Great day for outdoor farmers markets, taking the dog to the park, or raking leaves (then jumping in them). A warm jacket and your favorite fall sweater should do nicely.",
      "Brisk fall temperatures call for comfort activities. Visit that pumpkin patch you've been meaning to check out, take a scenic drive with the windows cracked, or have a bonfire if conditions allow. Don't forget your cozy hoodie and maybe some hand warmers."
    ];

    recommendations.push({
      icon: <Wind className="w-5 h-5" />,
      title: "Cool November Weather",
      description: selectVariation(coolDescriptions, seed),
      color: "text-blue-400",
    });
  } else if (temperature >= 10 && temperature < 16) {
    const mildDescriptions = [
      "Goldilocks temperature - not too hot, not too cold! Excellent for cycling through park trails, outdoor sketching or photography, or having lunch al fresco. Light jacket or hoodie recommended, but you probably won't need gloves. Make the most of these pleasant days!",
      "Mild and inviting weather that's begging you to get outside. Perfect for nature walks, visiting botanical gardens, or playing outdoor sports. The kind of day where you start with a jacket and end up carrying it. Consider a long bike ride or walking tour of your city.",
      "Comfortable November temps - rare and precious! Take advantage: go for a run without bundling up, wash your car without freezing your hands, or set up that outdoor game of soccer or frisbee. Light layers are all you need today."
    ];

    recommendations.push({
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Mild & Pleasant",
      description: selectVariation(mildDescriptions, seed),
      color: "text-green-400",
    });
  } else if (temperature >= 16 && temperature < 20) {
    const perfectFallDescriptions = [
      "This is it - peak autumn perfection! Drop everything and get outside. Ideal for hiking, picnicking in the park, outdoor yoga, or that photography project you've been planning. The fall foliage looks incredible in this temperature. Savor it - winter's coming!",
      "Absolutely gorgeous day! Perfect for a long nature walk, visiting an outdoor cafe, or exploring that new neighborhood on foot. Maybe grab a blanket for an outdoor reading session? Light jacket optional. These rare perfect days don't last long.",
      "Weather doesn't get better than this in November! Excellent for outdoor markets, open-air concerts, or kayaking if you're near water. Pack a picnic, invite friends to the park, or just sit outside and people-watch. A fleece or light jacket is plenty."
    ];

    recommendations.push({
      icon: <Sun className="w-5 h-5" />,
      title: "Perfect Fall Weather",
      description: selectVariation(perfectFallDescriptions, seed),
      color: "text-green-500",
    });
  } else if (temperature >= 20 && temperature < 25) {
    const warmComfortableDescriptions = [
      "Unseasonably warm and wonderful! Take your lunch break outside, move that meeting to a patio, or squeeze in an evening walk after work. Great for last-minute outdoor home projects, washing windows, or organizing the garage with the door open. T-shirt weather!",
      "Warm November surprise - embrace it! Perfect for outdoor dining, visiting the zoo or outdoor attractions, or taking your workout outside. Light, breathable fabrics will keep you comfortable. Maybe even time for that final pre-winter barbecue?",
      "Delightfully warm for this time of year. Excellent for gardening (last chance to plant those spring bulbs!), beach walks if you're coastal, or outdoor sports without heavy gear. Bring water and sunglasses - you might not need that jacket at all!"
    ];

    recommendations.push({
      icon: <Sun className="w-5 h-5" />,
      title: "Warm & Comfortable",
      description: selectVariation(warmComfortableDescriptions, seed),
      color: "text-yellow-500",
    });
  } else if (temperature >= 25 && temperature <= 27) {
    const warmDayDescriptions = [
      "Surprisingly warm! If you're in a cooler climate, this is unusual - enjoy it while it lasts. Beach walks, swimming if you're brave, or water sports are all on the table. Stay hydrated and wear light, breathable cotton or linen. SPF 30+ still applies!",
      "Hot for November! Great day for activities near water - lakeside parks, beach volleyball, or paddle boarding. Indoor option: hit the pool or splash pad if available. Wear shorts and a light shirt, and keep a water bottle handy. Sunset outdoor dining would be perfect.",
      "Warm enough to pretend it's still summer! Perfect for washing your car, outdoor yoga classes, or taking the kids to spray parks. Light colored, loose-fitting clothes recommended. Consider early morning or late afternoon activities to avoid peak heat."
    ];

    recommendations.push({
      icon: <Sun className="w-5 h-5" />,
      title: "Warm Day",
      description: selectVariation(warmDayDescriptions, seed),
      color: "text-orange-400",
    });
  } else if (temperature > 27 && temperature <= 30) {
    const hotDescriptions = [
      "Genuinely hot! Unusual for November in most places. Hit the beach, pool, or water park if available. Schedule outdoor activities before 10am or after 4pm to avoid peak sun. Wear sunscreen (SPF 50+), a hat, and sunglasses. Drink water before you feel thirsty!",
      "Summer temperatures in autumn - if you're somewhere tropical, this is normal; if not, enjoy the bonus warm day! Great for swimming, snorkeling, kayaking, or just lounging in the shade with a cold drink. Seek air conditioning during midday hours. Light, moisture-wicking fabrics are your friend.",
      "Hot enough to warrant heat awareness. Perfect for beach activities, water sports, or poolside relaxation. Avoid strenuous exercise during peak heat (11am-3pm). Keep cool with frozen treats, shaded rest breaks, and plenty of hydration. Evening is ideal for outdoor dining or walks."
    ];

    recommendations.push({
      icon: <Sun className="w-5 h-5" />,
      title: "Hot Weather",
      description: selectVariation(hotDescriptions, seed),
      color: "text-orange-500",
    });
  } else if (temperature > 30) {
    const veryHotDescriptions = [
      "Extreme heat! Seriously hot for any time of year. Stay in air conditioning during peak hours (10am-6pm). If you must go out: apply SPF 50+ every 2 hours, wear a wide-brimmed hat and UV-blocking sunglasses, drink 8-10 glasses of water. Watch for signs of heat exhaustion: dizziness, nausea, rapid pulse.",
      "Dangerously hot conditions. Check on vulnerable neighbors and pets - never leave anyone in parked cars. Indoor activities recommended: museums, malls, movie theaters. If outside: seek shade, take frequent cool-down breaks, wear light-colored loose clothing, and carry water everywhere. Swimming is ideal if available.",
      "Heat wave territory! Your day should revolve around staying cool. Early morning (before 9am) is safest for necessary outdoor tasks. Avoid alcohol and heavy meals. Keep curtains closed during peak sun. If no AC: take cool showers, use damp towels on neck and wrists, visit public cooling centers. This is no joke - heat exhaustion is a real risk."
    ];

    recommendations.push({
      icon: <Sun className="w-5 h-5" />,
      title: "Very Hot",
      description: selectVariation(veryHotDescriptions, seed),
      color: "text-red-500",
    });
  }

  // PRIORITY 3: WEATHER CONDITIONS (comprehensive coverage)
  if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
    const isHeavy = conditionLower.includes("heavy") || conditionLower.includes("moderate");

    if (isHeavy) {
      const heavyRainDescriptions = [
        "Torrential downpour incoming! Roads will flood quickly - avoid low-lying areas and never drive through standing water (even 6 inches can sweep away a car). If driving, turn on headlights, reduce speed by 50%, and increase following distance dramatically. Better yet, wait it out indoors with a movie and popcorn.",
        "Heavy rainfall warning. This is serious umbrella-breaking weather. If you must travel, drive slowly and watch for hydroplaning. Otherwise, perfect day to reorganize your closets, start that book you've been meaning to read, or have an indoor game day. Keep gutters and drains clear to prevent flooding.",
        "Major rain event! Postpone outdoor plans if possible. If caught outside, seek solid shelter immediately - not under trees. Drivers: headlights on, wipers on high, and pull over if visibility drops too low. Silver lining? Great white noise for productivity or napping. Check your basement for leaks!"
      ];

      recommendations.push({
        icon: <Umbrella className="w-5 h-5" />,
        title: "Heavy Rain Alert",
        description: selectVariation(heavyRainDescriptions, seed + 1),
        color: "text-blue-500",
      });
    } else {
      const lightRainDescriptions = [
        "Gentle rain falling - actually quite peaceful! Grab that colorful umbrella and waterproof shoes for puddle-jumping (yes, adults can do this too). Perfect weather for cozy cafe visits, museum exploration, or finishing indoor projects. The garden will thank you for this natural watering!",
        "Light drizzle day. Ideal for: testing out that new rain jacket, visiting covered markets, indoor rock climbing, or finally organizing your photos. If you embrace the wetness, it's actually great walking weather - just layer up. Plants and lawns are loving this! Maybe brew some tea and enjoy the patter on the windows?",
        "Sprinkling outside - nothing a decent umbrella can't handle. Great excuse to visit that bookstore or art gallery you've been curious about. If you don't mind getting a bit damp, dogs absolutely love walks in light rain. Runners: this is actually ideal running weather, just wear a cap to keep rain off your face."
      ];

      recommendations.push({
        icon: <Umbrella className="w-5 h-5" />,
        title: "Rainy Day",
        description: selectVariation(lightRainDescriptions, seed + 1),
        color: "text-blue-500",
      });
    }
  } else if (conditionLower.includes("snow")) {
    const isHeavy = conditionLower.includes("heavy") || conditionLower.includes("moderate");

    if (isHeavy) {
      const heavySnowDescriptions = [
        "Major snowfall alert! Travel is dangerous - cancel non-essential trips. Stock up now: water, snacks, flashlights, batteries. Clear snow every few hours (easier than one big pile). Check on neighbors. Kids: this is prime snow fort and sledding weather once it's safe! Adults: hot cocoa and movies.",
        "Heavy snow incoming - winter storm conditions. Avoid driving if at all possible; if you must go, pack emergency kit (blanket, water, snacks, phone charger). Shovel in stages to avoid overexertion. Keep walkways clear for deliveries and emergencies. Enjoy the beauty from inside with some baking or board games!",
        "Significant snowfall expected. Time to hunker down! Before it gets worse: bring in firewood, charge all devices, fill bathtubs with water (if power fails), prepare easy meals. Once accumulation stops: build that epic snowman, start a snowball fight, or try your hand at snow angels. Stay warm and patient!"
      ];

      recommendations.push({
        icon: <Snowflake className="w-5 h-5" />,
        title: "Heavy Snow Warning",
        description: selectVariation(heavySnowDescriptions, seed + 2),
        color: "text-cyan-400",
      });
    } else {
      const lightSnowDescriptions = [
        "Light snow dusting the ground - winter wonderland vibes! Perfect for: building a small snowman, taking gorgeous winter photos, cross-country skiing if you're equipped, or just catching snowflakes on your tongue. Drive carefully (slower speeds, gentle braking) but this is manageable snow. Hot chocolate recommended!",
        "Gentle snowfall creating a postcard scene. Great opportunity for winter nature walks (the silence in falling snow is magical), introducing kids to sledding, or taking your camera out for some snowy landscape shots. Wear layers and waterproof boots. Not enough to cause serious driving issues, but take it slow on bridges and overpasses.",
        "Picturesque light snow! Ideal conditions for: snowshoeing, winter hiking, visiting holiday markets if open, or just enjoying the peaceful snowfall from a warm window seat. If driving, brush ALL snow off your vehicle (even the roof). Maybe time for that soup you've been craving? The outdoors is calling the adventurous!"
      ];

      recommendations.push({
        icon: <Snowflake className="w-5 h-5" />,
        title: "Snowy Conditions",
        description: selectVariation(lightSnowDescriptions, seed + 2),
        color: "text-cyan-400",
      });
    }
  } else if (conditionLower.includes("overcast")) {
    const overcastDescriptions = [
      "Gray skies overhead - moody and atmospheric. Excellent lighting for photography (no harsh shadows!), perfect for museums, galleries, or that movie marathon you've been planning. The diffused light is great for outdoor portraits if you're into photography. Cozy sweater weather without the glare!",
      "Cloudy and contemplative weather. Great day for: indoor activities (shopping, bowling, escape rooms), or if you're feeling introspective, a solitary walk in the park can be quite meditative. No need for sunglasses! This light is actually ideal for reading outside if it's not too cold. Embrace the gray!",
      "Overcast but not necessarily gloomy! Perfect conditions for: running (no sun glare), visiting botanical gardens or greenhouses, or tackling that indoor project list. The soft light is actually beautiful for outdoor activities if you're not chasing sunshine. Layer up and lean into the mellow atmosphere."
    ];

    recommendations.push({
      icon: <Wind className="w-5 h-5" />,
      title: "Overcast Skies",
      description: selectVariation(overcastDescriptions, seed + 3),
      color: "text-gray-500",
    });
  } else if (conditionLower.includes("partly cloudy") || conditionLower.includes("partial")) {
    const partlyCloudyDescriptions = [
      "Mix of sun and clouds - best of both worlds! Perfect variable light for photography, great for any outdoor activity without constant sun exposure. Ideal for: hiking (clouds keep you from overheating), cycling, outdoor markets, or just wandering your city. Light jacket should suffice. Enjoy the dramatic sky!",
      "Partly cloudy and pleasant! The clouds provide nice breaks from direct sun - perfect for outdoor sports, dog park visits, or washing your car. Great day for exploring new neighborhoods on foot or bike. The shifting light makes for interesting sky-watching. You might need sunglasses intermittently!",
      "Dynamic skies with sun breaks! Excellent for: outdoor dining (sun without constant glare), playground time with kids, geocaching, or bird watching. The varied light conditions are perfect for testing your photography skills. Dress in layers you can adjust as sun comes and goes. Beautiful cloud formations likely!"
    ];

    recommendations.push({
      icon: <Sun className="w-5 h-5" />,
      title: "Partly Cloudy",
      description: selectVariation(partlyCloudyDescriptions, seed + 4),
      color: "text-gray-400",
    });
  } else if (conditionLower.includes("cloudy")) {
    const cloudyDescriptions = [
      "Mostly cloudy skies - nature's sun filter! Great for activities where sun glare is annoying: tennis, baseball, beach walks, or reading outside. Perfect for outdoor exercise without overheating. The even lighting is excellent for taking outdoor group photos (everyone can keep their eyes open!). No sunscreen needed, but bring a light layer.",
      "Cloudy day ahead. Ideal for: walking tours (no squinting at tour guides!), outdoor sports, gardening (clouds keep you cool while working), or that long bike ride you've been planning. Photographers: the soft light is perfect for portraits. Won't need sunglasses, but weather can change - maybe pack a light rain shell just in case.",
      "Fully clouded but not threatening rain. Perfect conditions for: outdoor jogging, dog walking, or any activity where you want to avoid harsh sun but stay outside. Great day for yard work - you won't overheat. The muted light is surprisingly beautiful for nature photography. Comfortable temperature regulation without solar intensity!"
    ];

    recommendations.push({
      icon: <Wind className="w-5 h-5" />,
      title: "Cloudy Day",
      description: selectVariation(cloudyDescriptions, seed + 5),
      color: "text-gray-400",
    });
  } else if (conditionLower.includes("clear") || conditionLower.includes("sun") || conditionLower.includes("mainly clear")) {
    const clearDescriptions = [
      "Brilliant sunshine and clear blue skies! Don't waste this indoors. Perfect for: hiking with incredible views, outdoor photography (golden hour will be amazing), picnics, cycling, or just sitting in a park with a good book. SPF 30+ essential even in fall - UV rays don't take November off. Sunglasses and a hat recommended. Gorgeous day!",
      "Crystal clear skies - make the most of it! Excellent visibility for: nature walks, bird watching, outdoor sports, or visiting scenic overlooks. Tonight's stargazing will be phenomenal if you stay up. Perfect day for washing windows (inside and out), solar charging devices, or just soaking up vitamin D. Don't forget sun protection!",
      "Absolutely stunning clear weather! Ideal for: aerial activities if you're adventurous (hot air balloons, scenic flights), long distance hiking or biking, outdoor dining, or finally cleaning those outdoor spaces. The clarity makes distant views spectacular. Great day for drone photography or just appreciating nature's beauty. Hat and sunscreen are must-haves!"
    ];

    recommendations.push({
      icon: <Sun className="w-5 h-5" />,
      title: "Clear Skies",
      description: selectVariation(clearDescriptions, seed + 6),
      color: "text-yellow-500",
    });
  }

  // PRIORITY 4: WIND CONDITIONS (enhanced thresholds)
  if (windSpeed > 30) {
    const veryWindyDescriptions = [
      "Seriously strong winds - hold onto your hat (literally)! Secure or bring inside: patio furniture, trampolines, garbage cans, decorations. Avoid parking under trees or near anything that could blow over. High-profile vehicles (trucks, SUVs, RVs) should avoid highway driving if possible. Power outages possible - charge devices now. Definitely NOT umbrella weather!",
      "Dangerous wind conditions! Stay indoors if you can. Falling branches are a real hazard - avoid wooded areas and parks. If driving, both hands on wheel and watch for debris on roads. Secure anything outside that could become a projectile. Great day for indoor activities: gaming, cooking, organizing. Listen for emergency alerts. Don't attempt to fix roof/outdoor items until wind dies down.",
      "Extreme wind alert! This is small-craft-advisory territory. Outdoor activities are dangerous - postpone that bike ride or outdoor workout. If you must go out, dress in form-fitting layers (loose clothing will whip around). Be extra careful with car doors - wind can rip them from hinges. Trees may uproot - stay clear. Perfect excuse for indoor hobbies or movie marathon!"
    ];

    recommendations.push({
      icon: <Wind className="w-5 h-5" />,
      title: "⚠️ Very Windy",
      description: selectVariation(veryWindyDescriptions, seed + 7),
      color: "text-red-500",
    });
  } else if (windSpeed > 20) {
    const windyDescriptions = [
      "Breezy conditions - your hair will have opinions today! Secure lightweight outdoor items (chair cushions, small plants, kids' toys). Actually perfect for kite flying, windsurfing, or sailing if you're into that. Cyclists: expect some resistance! Umbrella use is risky. Great natural ventilation if you're painting or cleaning indoors with windows open.",
      "Moderate winds making things interesting! Good day for: flying drones (if you're experienced), testing that new windbreaker, or flying kites with kids. Bad day for: outdoor painting, setting up tents, playing with loose paper outside. Car doors will swing wide - hold tight! Windows down for a refreshing drive, but expect some noise. Your wind chimes are earning their keep today!",
      "Windy enough to notice! Perfect for airing out your house or car (open those windows!), drying laundry outside super fast, or watching trees dance. If cycling or running, plan your route to minimize headwinds on the return trip. Outdoor dining might be challenging - napkins will escape! Boats and sailboards would love this. Avoid using ladders or working at heights."
    ];

    recommendations.push({
      icon: <Wind className="w-5 h-5" />,
      title: "Windy Conditions",
      description: selectVariation(windyDescriptions, seed + 7),
      color: "text-gray-500",
    });
  }

  // PRIORITY 5: HUMIDITY CONDITIONS (expanded ranges)
  if (humidity > 85) {
    const veryHumidDescriptions = [
      "Oppressively humid - the air feels like soup! Sweat won't evaporate easily, so your body's cooling system is compromised. Take it easy on outdoor activity. Ideal day for: swimming (you're getting wet anyway!), air-conditioned museums, indoor ice skating, or mall walking. Wear moisture-wicking fabrics if you must be outside. Drink water constantly - dehydration sneaks up in humidity.",
      "Extremely muggy conditions - that sticky, clingy feeling. Your glasses will fog stepping outside! Good day for: water activities (pool, beach, splash pad), visiting aquariums or indoor attractions, or catching up on indoor chores. If exercising outside, go super early or late evening, take frequent breaks, and watch for heat exhaustion signs. Dehumidifiers working overtime today!",
      "Thick, heavy air - feels like breathing through a wet towel. Heat index is significantly higher than actual temperature! Avoid midday outdoor activities. Perfect weather for: staying near water (sprinklers, pools, water parks), enjoying iced drinks on shaded patios, or embracing indoor hobbies. Cotton clothes will stick - try synthetic moisture-wicking materials. Keep electrolyte drinks handy."
    ];

    recommendations.push({
      icon: <Droplets className="w-5 h-5" />,
      title: "Very Humid",
      description: selectVariation(veryHumidDescriptions, seed + 8),
      color: "text-teal-600",
    });
  } else if (humidity > 70) {
    const highHumidDescriptions = [
      "Noticeably humid - that slightly sticky feeling. Your hair might get wavy or frizzy (embrace it!). Great day for: water activities, visiting greenhouses (they won't feel as stuffy), or indoor sports. Outdoor exercise is okay but you'll sweat more than usual - plan accordingly. Breathable fabrics like linen or performance wear recommended. Good excuse to try that new smoothie recipe!",
      "Humid but manageable. Morning dew will be heavy - wet grass alert for shoes! Actually nice if you're near water - beach, pool, or lake activities feel refreshing. Not great for freshly blow-dried hair. Photographs might have that soft, hazy quality. If exercising outdoors, bring extra water and slow your pace slightly. AC feels amazing after being outside. Plants are thriving!",
      "Moderately humid atmosphere. You'll notice it but it's not oppressive. Perfect for: tropical plant care (they love this!), car washing (spots won't dry as fast), or relaxed outdoor activities by water. Indoor climbing gyms or swimming are ideal exercises today. Bring a small towel for wiping sweat. Your cold drinks will collect condensation - coasters recommended! Laundry might take longer to dry."
    ];

    recommendations.push({
      icon: <Droplets className="w-5 h-5" />,
      title: "High Humidity",
      description: selectVariation(highHumidDescriptions, seed + 8),
      color: "text-teal-500",
    });
  } else if (humidity < 30) {
    const dryAirDescriptions = [
      "Desert-dry air today! Your skin, lips, and nasal passages will notice. Essential today: lip balm, hand lotion, moisturizing face cream, and drinking extra water (even if not thirsty). Great for: drying wet items, preventing mold, or outdoor activities without sweat stickiness. Static electricity will be annoying - dryer sheets are your friend. Run a humidifier indoors, especially while sleeping.",
      "Extremely low humidity - crispy air! Your sinuses might feel dry or irritated - saline nasal spray helps. Perfect for: outdoor laundry drying, preventing foggy mirrors, or any activity where you don't want to sweat. Bad for: contact lenses (bring rewetting drops), acoustic guitars (they can crack), and indoor plants (they need extra water). Drink way more water than usual. Moisturize everything!",
      "Exceptionally dry conditions - moisture is scarce! Static shocks when touching metal are inevitable. Good news: your hair might be more manageable, clothes dry quickly, and it feels less cold than the temperature suggests. Bad news: chapped lips, dry skin, potential nosebleeds. Solutions: carry moisturizer, use a humidifier, drink constantly, avoid long hot showers (they dry skin more). Great for outdoor activities, terrible for allergies."
    ];

    recommendations.push({
      icon: <Droplets className="w-5 h-5" />,
      title: "Dry Air",
      description: selectVariation(dryAirDescriptions, seed + 9),
      color: "text-amber-500",
    });
  }

  // PRIORITY 6: MULTI-FACTOR COMBINATIONS (context-aware)
  if (temperature < 4 && (conditionLower.includes("rain") || conditionLower.includes("drizzle"))) {
    const coldWetDescriptions = [
      "Dangerous cold + wet combination! Hypothermia risk is REAL even above freezing - wet clothes lose 90% of insulation. If you must go out: waterproof everything (jacket, pants, boots, gloves). Change out of wet clothes IMMEDIATELY when inside. Better plan: stay home with hot soup and warm beverages. This weather can turn serious fast - don't underestimate it!",
      "Seriously miserable and potentially dangerous conditions - cold rain cuts through everything. If caught outside, seek shelter NOW - even a gas station or store overhang. Wet + cold = hypothermia danger, even for short exposures. Layer up with waterproof outer shell over insulating layers. Perfect day to meal prep, reorganize closets, or binge that series. Not worth risking your health!",
      "Cold and wet - the worst weather combo! This isn't just uncomfortable, it's hazardous. Your body loses heat 25x faster when wet. Absolutely essential if going out: waterproof outer layer, insulating middle layer that works when wet (fleece, not cotton!), dry base layer, waterproof footwear. Honestly? Cancel plans if possible. Cozy indoor day with blankets and hot drinks is the smart call."
    ];

    recommendations.push({
      icon: <Snowflake className="w-5 h-5" />,
      title: "⚠️ Hypothermia Risk",
      description: selectVariation(coldWetDescriptions, seed + 10),
      color: "text-red-600",
    });
  }

  if (temperature > 27 && humidity > 70) {
    const hotHumidDescriptions = [
      "Dangerous heat index! Your body can't cool itself effectively when humidity is this high - sweat won't evaporate. Heat exhaustion and heat stroke are real risks. Stay in AC during peak hours (10am-4pm). If outside: frequent shade breaks, drink water every 15 minutes, watch for dizziness/nausea/confusion. Best activities: swimming, indoor sports, air-conditioned venues. This is serious - thousands hospitalized yearly from this combination!",
      "Oppressive heat + humidity = potentially dangerous conditions. The 'feels like' temperature is way higher than the thermometer shows! Limit outdoor activity to early morning or evening. Essential precautions: hydrate before going out, wear light-colored moisture-wicking clothes, take breaks in AC every 20-30 minutes, never leave anyone in cars. Watch for heat exhaustion signs: heavy sweating, weakness, cold/clammy skin, rapid pulse. Water activities only!",
      "Heat wave + high humidity alert! This combo is no joke - your sweat can't evaporate to cool you down. Risk of heat-related illness is HIGH. Smart moves: pool time, beach visits, indoor attractions, shopping malls. Avoid: outdoor sports, yard work, strenuous activity. If you must be outside: shade only, water constantly, short 15-minute intervals max. Check on elderly neighbors. Pets need extra water and AC too!"
    ];

    recommendations.push({
      icon: <Sun className="w-5 h-5" />,
      title: "⚠️ Heat Index High",
      description: selectVariation(hotHumidDescriptions, seed + 11),
      color: "text-red-500",
    });
  }

  if (windSpeed > 20 && (conditionLower.includes("rain") || conditionLower.includes("snow"))) {
    const stormDescriptions = [
      "Storm conditions - wind + precipitation is hazardous! Visibility severely reduced, roads extremely dangerous. Avoid ALL unnecessary travel - seriously, stay home. If you absolutely must drive: both hands on wheel, headlights on, speed reduced by 50%, hazards on if going significantly below limit, pull over completely if conditions worsen. Flying debris is a real danger. Indoor day - use it for productive projects or relaxation!",
      "Severe weather event - wind-driven rain/snow creates terrible conditions. This is NOT the time to prove how tough you are. High risk of: hydroplaning, blown-over vehicles (especially trucks/SUVs), downed trees/power lines, flying debris. If outside when it hits, get indoors immediately. If in car, find safe place to wait it out. Perfect excuse to cancel plans guilt-free. Hot drinks, good book, safe at home - that's the goal today.",
      "Dangerous combination alert! Wind + precipitation = blinding conditions and serious hazards. Trees can fall, power can fail, roads become skating rinks (if cold enough). Travel is strongly discouraged - not worth the risk. If you're stuck outside: seek substantial shelter, NOT under trees. Drivers: extreme caution, reduced speed, be prepared to pull over. This weather means business - respect it and stay safe indoors if at all possible!"
    ];

    recommendations.push({
      icon: <Wind className="w-5 h-5" />,
      title: "⚠️ Storm Conditions",
      description: selectVariation(stormDescriptions, seed + 12),
      color: "text-red-500",
    });
  }

  // PRIORITY 7: Ensure at least one recommendation
  if (recommendations.length === 0) {
    const fallbackDescriptions = [
      "Typical November weather - nothing extreme to report! Good day for: whatever you had planned, really. Check hourly forecast for any changes. Dress in comfortable layers for the season. Maybe a jacket, maybe not - you know your tolerance. Great time to catch up on outdoor or indoor tasks as weather allows. Unremarkable weather = maximum flexibility!",
      "Standard fall conditions. Neither spectacular nor terrible - just regular November vibes. Perfect for: routine activities, running errands, regular workouts, or tackling that to-do list. No special weather precautions needed. Layer appropriately and you're set. Sometimes boring weather is the best weather - no surprises, just get stuff done!",
      "Nothing unusual on the weather front today. Seasonal temperatures and conditions - exactly what you'd expect for this time of year. Great for: normal daily activities, planned outdoor events, or indoor projects. No drama, no excitement, just typical weather. Check your local forecast for specifics and dress accordingly. Steady as she goes!"
    ];

    recommendations.push({
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Typical November Day",
      description: selectVariation(fallbackDescriptions, seed + 13),
      color: "text-purple-500",
    });
  }

  // Return top 3 highest priority recommendations
  return recommendations.slice(0, 3);
}

export function WeatherRecommendations({ weather }: WeatherRecommendationsProps) {
  const recommendations = getWeatherRecommendations(weather);

  return (
    <Card className="w-full shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Weather Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className={`mt-0.5 ${rec.color}`}>{rec.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                <p className="text-sm text-muted-foreground">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
