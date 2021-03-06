% NASA Space Challenge
% April 19, 2013
% Toronto, ROM
% Hamid Tizhoosh, Univesity of Waterloo

function varargout = IrradiancePrediction(varargin)
% IRRADIANCEPREDICTION M-file for IrradiancePrediction.fig
%      IRRADIANCEPREDICTION, by itself, creates a new IRRADIANCEPREDICTION or raises the existing
%      singleton*.
%
%      H = IRRADIANCEPREDICTION returns the handle to a new IRRADIANCEPREDICTION or the handle to
%      the existing singleton*.
%
%      IRRADIANCEPREDICTION('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in IRRADIANCEPREDICTION.M with the given input arguments.
%
%      IRRADIANCEPREDICTION('Property','Value',...) creates a new IRRADIANCEPREDICTION or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before IrradiancePrediction_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to IrradiancePrediction_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help IrradiancePrediction

% Last Modified by GUIDE v2.5 20-Apr-2013 13:35:58

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @IrradiancePrediction_OpeningFcn, ...
                   'gui_OutputFcn',  @IrradiancePrediction_OutputFcn, ...
                   'gui_LayoutFcn',  [] , ...
                   'gui_Callback',   []);
if nargin && ischar(varargin{1})
    gui_State.gui_Callback = str2func(varargin{1});
end

if nargout
    [varargout{1:nargout}] = gui_mainfcn(gui_State, varargin{:});
else
    gui_mainfcn(gui_State, varargin{:});
end
% End initialization code - DO NOT EDIT


% --- Executes just before IrradiancePrediction is made visible.
function IrradiancePrediction_OpeningFcn(hObject, eventdata, handles, varargin)
% This function has no output args, see OutputFcn.
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% varargin   command line arguments to IrradiancePrediction (see VARARGIN)

% Choose default command line output for IrradiancePrediction
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes IrradiancePrediction wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = IrradiancePrediction_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;


% --- Executes on button press in pushbuttonGetData.
function pushbuttonGetData_Callback(hObject, eventdata, handles)
% hObject    handle to pushbuttonGetData (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
numYears = 10;
SunData = getSunData(numYears);
handles.Data = SunData;
axes(handles.axes1)
imagesc(handles.Data), axis off
guidata(hObject, handles);



function editNumYears_Callback(hObject, eventdata, handles)
% hObject    handle to editNumYears (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of editNumYears as text
%        str2double(get(hObject,'String')) returns contents of editNumYears as a double


% --- Executes during object creation, after setting all properties.
function editNumYears_CreateFcn(hObject, eventdata, handles)
% hObject    handle to editNumYears (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end


% --- Executes on slider movement.
function sliderSunniness_Callback(hObject, eventdata, handles)
% hObject    handle to sliderSunniness (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'Value') returns position of slider
%        get(hObject,'Min') and get(hObject,'Max') to determine range of slider


% --- Executes during object creation, after setting all properties.
function sliderSunniness_CreateFcn(hObject, eventdata, handles)
% hObject    handle to sliderSunniness (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: slider controls usually have a light gray background.
if isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor',[.9 .9 .9]);
end


% --- Executes on button press in pushbuttonPredict.
function pushbuttonPredict_Callback(hObject, eventdata, handles)
% hObject    handle to pushbuttonPredict (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
axes(handles.axes2)
imagesc([])
SunDataFuture = PredictFuture(handles.Data)
handles.DataFuture = SunDataFuture;
axes(handles.axes2)
imagesc(handles.DataFuture), axis off
