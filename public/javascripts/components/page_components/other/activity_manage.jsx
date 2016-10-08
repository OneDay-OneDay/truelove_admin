import React from "react";
import { Link } from "react-router";
import { fetch_data_get } from "../../../../../fetch_function/fetch.js";
import { Spin, Pagination } from "antd";
import "../../../../stylesheets/page_components/other/activity_manage.scss";

class ActivityManage extends React.Component{
	constructor( props ){
		super( props )
		window.scrollTo( 0, 0 );
		this.state = {
			loading : false,
			activity_list : [ {  } ],
			activity_total : 0,
			current : 1
		}
	}

	componentDidMount(  ){
		this.get_activity_list( 1 )
	}

	get_activity_list( page ){
		var _this = this;
		_this.setState({ loading : true });
		fetch_data_get("/api/get_activity_list", { truelove_admin_token : localStorage.truelove_admin_token, page : page })
			.then(( result ) => {
				let activity_list = [  ];
				let activity_total = result.body.activity_total;
				result.body.activity_list.map(( ele, key ) => {
					activity_list.push({
						key : key,
						activity_id : ele.activity_id,
						activity_cover : ele.activity_cover,
	  					activity_subject : ele.activity_subject,
	  					activity_publish_date : ele.activity_publish_date
					})
				});
				_this.setState({
					loading : false,
					activity_list : activity_list,
					activity_total : activity_total
				});
			})
			.catch(( error ) => { console.log( error ) });
	}

	onChange( page ){
		console.log( page );
		window.scrollTo( 0, 0 );
    		this.setState({ current: page });
    		this.get_activity_list( page );
	}
	
	render(  ){
		return(
			<div className="activity_manage_wrap">
				<Spin size="large" spinning={ this.state.loading } >
				{
					( this.state.activity_list ).length != 0 ? this.state.activity_list.map(( ele, key ) => {
						return(
							<div key={ key } className="activity_item">
								<Link to="/truelove_admin/activity_detail" query={{ activity_id : ele.activity_id }}>
									<div className="activity_cover">
										<img src={ ele.activity_cover }/>
										<div className="black_banner">
											<div className="activity_subject">活动主题：{ ele.activity_subject }</div>
											<div className="activity_publish_date">发布日期：{ ele.activity_publish_date }</div>
										</div>
									</div>
								</Link>
							</div>
						)
					}) : <div className="activity_empty">还没有发布过什么活动哦 ~ </div>
				}
				</Spin>
				<div className="pagination">
					<Pagination current={ this.state.current } onChange={ ( page ) => this.onChange( page ) } total={ this.state.activity_total } />
				</div>
			</div>
		)
	}
}

export default ActivityManage