using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FindHeight : MonoBehaviour {

    [SerializeField] private Texture2D heightmap;
    [SerializeField] private Vector3 size;

    private void Update() {
        //Debug.Log(GetHeight(transform.position));
    }

    public int GetHeight(Vector2 pos) {
        int x = Mathf.FloorToInt((pos.x / size.x + 0.5f) * heightmap.width);
        int y = Mathf.FloorToInt((pos.y / size.y + 0.5f) * heightmap.height);
        return Mathf.CeilToInt(heightmap.GetPixel(x, y).grayscale * 8848f);
    }
}
