using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using System.Linq;

public class ChangeHeight : MonoBehaviour{

    [SerializeField] private Slider slider;
    [SerializeField] private int minChange;
    [SerializeField] private GameObject displayMapObj;
    [SerializeField] private GameObject playObj;
    [SerializeField] private FindHeight findHeightScr;
    private DisplayMap displayMap;

    [SerializeField] private TMP_Text meterText;
    [SerializeField] private TMP_Text displacedText;

    private int prevSliderVal = 0;
    private List<long> populationAtHeight = Enumerable.Repeat((long)0, 9000).ToList();

    private void Start()
    {
        playObj.SetActive(false);
        displayMap = displayMapObj.GetComponent<DisplayMap>();

        string path = Path.Combine(Application.dataPath, "processedData.json");
        string json = File.ReadAllText(path);
        CityData[] cities = JsonHelper.FromJson<CityData>(json);


        foreach (CityData city in cities)
        {
            populationAtHeight[findHeightScr.GetHeight(new Vector2(city.latitude, city.longitude))+1] += (long)city.population;
        }
        for (int i = 1; i<8900; i++)
        {
            populationAtHeight[i] += populationAtHeight[i - 1];
        }
    }
    private void Update(){
        int SliderVal = (int)(slider.value * 8848f);
        meterText.text = "Meters above normal water level: " + SliderVal +"m";
        if (Mathf.Abs(SliderVal - prevSliderVal) > minChange)
        {
            prevSliderVal = SliderVal;
            displayMap.WaterLevel = SliderVal;
            displayMap.updateMap();
        }
        string formattedNumber = populationAtHeight[SliderVal].ToString("N0"); // .Replace(",", " ")
        displacedText.text = "People displaced: "+formattedNumber;
    }
}


[System.Serializable]
public class CityData
{
    public string name;
    public string country;
    public string province;
    public int population;
    public float latitude;
    public float longitude;
    public int height;
}

public static class JsonHelper
{
    public static T[] FromJson<T>(string json)
    {
        string newJson = "{ \"array\": " + json + "}";
        Wrapper<T> wrapper = JsonUtility.FromJson<Wrapper<T>>(newJson);
        return wrapper.array;
    }

    [System.Serializable]
    private class Wrapper<T>
    {
        public T[] array;
    }
}


