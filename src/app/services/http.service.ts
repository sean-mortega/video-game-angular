import { HttpClient, HttpParams } from '@angular/common/http';
import { environment as env } from 'src/environments/environment.development';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { Game, APIResponse } from '../models';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {
  }

  getGameList(
    ordering: string,
    search?: string
  ): Observable<APIResponse<Game>> {
    let params = new HttpParams().set('ordering', ordering);

    if(search) {
      params = new HttpParams().set('ordering', ordering).set('search', search);
    }

    return this.http.get<APIResponse<Game>>(`${ env.BASE_URL}/games`, {
      params: params,
    });

  }

  getGameDetails(id: string, slug: string): Observable<Game> {
    const gameInfoRequest = this.http.get(`${env.BASE_URL}/games/${id}`);
    const gameTrailersRequest = this.http.get(
      `${env.BASE_URL}/games/${id}/movies`
    );
    const gameScreenshotsRequest = this.http.get(
      `${env.BASE_URL}/games/${slug}/screenshots`
    );

    return forkJoin({
      gameInfoRequest,
       //gameScreenshotsRequest
      // gameTrailersRequest,
    }).pipe(
      map((resp: any) => {
        return {
          ...resp['gameInfoRequest'],
          screenshots: resp['gameScreenshotsRequest']?.results,
          trailers: resp['gameTrailersRequest']?.results,
        };
      })
    );
  }

  


}
