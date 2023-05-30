using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DisplayMap : MonoBehaviour {

    [SerializeField] GameObject FindHeightObject;
    private FindHeight FindHeightScript;

    private Texture2D texture;
    private SpriteRenderer spriteRenderer;

    [NonSerialized] public int WaterLevel = 0;

    private int ScaleChange = 3;

    private int ySize = 1080;
    private int xSize = 1920;
    private void Start() {
        ySize = 1080 / ScaleChange;
        xSize = 1920 / ScaleChange;
        FindHeightScript = FindHeightObject.GetComponent<FindHeight>();  
        spriteRenderer = GetComponent<SpriteRenderer>();
        texture = new Texture2D(xSize, ySize);
        transform.position = new Vector3(-96, -54, 0);
        spriteRenderer.size = new Vector3(xSize, ySize, 0);
        spriteRenderer.sprite = Sprite.Create(texture, new Rect(0, 0, texture.width, texture.height), Vector2.zero);
        updateMap();
    }


    public void updateMap()
    {
        for (int y = 0; y < texture.height; y++)
        {
            float Y = (y - texture.height / 2) / 10.0f * ScaleChange;
            for (int x = 0; x < texture.width; x++)
            {
                float X = (x - texture.width / 2) / 10.0f * ScaleChange;
                Color col = (FindHeightScript.GetHeight(new Vector2(X, Y)) <= WaterLevel ? Color.blue : Color.green);
                // if(FindHeightScript.GetHeight(new Vector2(X, Y)) > 0) Debug.Log(new Vector2(X, Y));
                texture.SetPixel(x, y, col);
            }
        }
        texture.Apply();
    }


}
