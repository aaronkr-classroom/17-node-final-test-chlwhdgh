// controllers/discussionsController.js
"use strict";

const { disconnect } = require("mongoose");

const Discussion = require("../models/Discussion"), // 사용자 모델 요청
  getDiscussionParams = (body, user) => {
    return {
      title: body.title,
      description: body.description,
      author: user,
      category: body.category,
      tags: body.tags,
    };
  };

  module.exports = {
    /**
     * =====================================================================
     * C: CREATE / 생성
     * =====================================================================
     */
    new: (req, res) => {
      res.render("discussions/new", {
        page: "new-user",
        title: "New discussions",
      });
    }, // 1. new: 액션,
    
    create: (req, res, next) => {
      let discussionParams = {
        name: {
          first: req.body.first,
          last: req.body.last,
        },
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        profileImg: req.body.profileImg,
      };
      Discussion.create(discussionParms)
        .then((discussion) => {
          res.locals.redirect = "/discussions";
          res.locals.discussion = discussion;
          next();
        }) 
        .catch((error) => {
          console.log(`Error saving discussions: ${error.message}`);
          next(error);
        });
      },// 2. create: 액션,
    
      redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
      },// 3. redirectView: 액션,
    /**
     * =====================================================================
     * R: READ / 조회
     * =====================================================================
     */
    /**
     * ------------------------------------
     * ALL records / 모든 레코드
     * ------------------------------------
     */
    index: (req, res, next) => {
      Discussion.find()
        .populate("author")
        .exec()
        .then((discussions) => {
          res.locals.discussions = discussions;
          next();
        })
        .catch((error) => {
          console.log(`Error fetching discussions: ${error.message}`);
          next(error);
        });
    },    // 4. index: 액션,
    indexView: (req, res) => {
      res.render("discussions/index", {
        page: "discussions",
        title: "All Discussions",
      });
    },// 5. indexView: 엑션,
    /**
     * ------------------------------------
     * SINGLE record / 단일 레코드
     * ------------------------------------
     */
    show: (req, res, next) => {
      let discussionId = req.params.id; // request params로부터 사용자 ID 수집
      Discussion.findById(req.params.id)
      .populate("author")
      .populate("comments") // ID로 사용자 찾기
      .then((user) => {
        res.locals.user = user; // 응답 객체를 통해 다음 믿들웨어 함수로 사용자 전달
        next();
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error); // 에러를 로깅하고 다음 함수로 전달
      });
    },
    // 6. show: 액션,
    showView: (req, res) => {
      res.render("discussion/show", {
        page: "discussion-details",
        title: "Discussion Details",
      });
    },
    // 7. showView: 액션,
    /**
     * =====================================================================
     * U: UPDATE / 수정
     * =====================================================================
     */
    edit: (req, res, next) => {
      let discussionId = req.params.id;
      Discussion.findById(req.params.Id)
        .populate("author")
        .populate("comments") // ID로 데이터베이스에서 사용자를 찾기 위한 findById 사용
        .then((discussion) => {
          res.render("discussions/edit", {
            discussion: discussion,
            page: "edit-discussion",
            title: "Edit Discussion",
          }); // 데이터베이스에서 내 특정 사용자를 위한 편집 페이지 렌더링
        })
        .catch((error) => {
          console.log(`Error fetching user by ID: ${error.message}`);
          next(error);
        });
    },
    // 8. edit: 액션,
    update: (req, res, next) => {
      let discussionId = req.params.id,
        discussionParams = getDiscussionParams(req.body);
  
      Discussion.findByIdAndUpdate(discussionId, {
        $set: discussionParams,
      }) 
        .populate("author")//ID로 사용자를 찾아 단일 명령으로 레코드를 수정하기 위한 findByIdAndUpdate의 사용
        .then((discussion) => {
          res.locals.redirect = `/discussions/${discussionId}`;
          res.locals.discussion= discussion;
          next(); // 지역 변수로서 응답하기 위해 사용자를 추가하고 다음 미들웨어 함수 호출
        })
        .catch((error) => {
          console.log(`Error updating user by ID: ${error.message}`);
          next(error);
        });
    },
    // 9. update: 액션,
    /**
     * =====================================================================
     * D: DELETE / 삭제
     * =====================================================================
     */
    delete: (req, res, next) => {
      let discussionId = req.params.id;
      Discussion.findByIdAndRemove(discussionId) // findByIdAndRemove 메소드를 이용한 사용자 삭제
        .then(() => {
          res.locals.redirect = "/discussions";
          next();
        })
        .catch((error) => {
          console.log(`Error deleting user by ID: ${error.message}`);
          next();
        });
    },
    // 10. delete: 액션,
  };
  
