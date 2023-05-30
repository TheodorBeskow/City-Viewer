using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class ChangeHeight : MonoBehaviour{

    [SerializeField] private Slider slider;
    [SerializeField] private int minChange;
    [SerializeField] private GameObject displayMapObj;
    [SerializeField] private GameObject playObj;
    private DisplayMap displayMap;

    [SerializeField] private TMP_Text meterText;

    private int prevSliderVal = 0;

    private void Start()
    {
        playObj.SetActive(false);
        displayMap = displayMapObj.GetComponent<DisplayMap>();
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
    }


}
